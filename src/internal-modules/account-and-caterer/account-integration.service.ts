import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAccountIntegrationProvider } from './interfaces';
import { IAccountIntegrationFieldConfigurationJson } from './interfaces/account-integration-fields.json-interface';
import * as Sentry from '@sentry/node';
import { validateAccountCrmWithCrmAndSecretReferences } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-crm-with-crm-and-secret-refs.schema-and-validator';
import { AccountIntegrationType } from './types';
import { missingConfigCheck } from './utility/account-integration/missing-config-check.account-integration-utility-function';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountCrmIntegratorService } from './integration-classes/account-crm-integrator.service';
import { AccountPermissionService } from '../security-utility/account-permission.service';

// MAY NOT INJECT:
// AccountSecretService
@Injectable()
export class AccountIntegrationService implements IAccountIntegrationProvider {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly accountCrmIntegrator: AccountCrmIntegratorService,
    private readonly accountPermissionService: AccountPermissionService,
  ) {}

  // @TODO refactor to use accountCrm integration class
  async getAccountIntegration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    tokenAccountId: string,
    userId: string,
  ) {
    let result: any;
    switch (integrationType) {
      case 'CRM':
        const accountCrmWithCrmAndSecretReferences =
          await this.accountIntegrationDbHandler.retrieveAccountCrmById(
            accountIntegrationId,
            {
              crm: true,
              crmSecretRefs: true,
            },
          );
        if (!accountCrmWithCrmAndSecretReferences) {
          throw new NotFoundException();
        }

        // Validates result
        // Confirms that accountCrm belongs to token's accountId
        // Reports whether crm is fully configured, and if not, what's missing
        const isAccountCrmFullyConfiguredResult =
          await this.isAccountCrmFullyConfigured(
            accountCrmWithCrmAndSecretReferences,
            tokenAccountId,
            userId,
          );

        result.integration = accountCrmWithCrmAndSecretReferences;

        result = {
          ...isAccountCrmFullyConfiguredResult,
          integration: accountCrmWithCrmAndSecretReferences,
        };

        break;
      default:
        const err = new UnprocessableEntityException();
        Sentry.withScope((scope) => {
          scope.setExtra('integrationType', integrationType);
          Sentry.captureException(err);
        });
        throw err;
    }

    if (typeof result.integration === 'object' && result.integration != null) {
      delete result.integration.accountId;
    }
    return result;
  }

  async getAccountIntegrationsOfType(
    integrationType: AccountIntegrationType,
    accountId: string,
    requesterId: string,
  ) {
    // Check permission
    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requesterId,
        accountId,
        'EDIT_ACCOUNT_INTEGRATIONS',
      ))
    ) {
      throw new UnauthorizedException();
    }

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.retrieveAll(accountId);
      default:
        throw new BadRequestException('Invalid integration type');
    }
  }

  // @TODO abstract to Integration level and move this to AccountCrm
  async isAccountCrmFullyConfigured(
    input: string | unknown,
    tokenAccountId: string,
    userId: string,
  ): Promise<{
    isFullyConfigured: boolean;
    missingConfigs?: IAccountIntegrationFieldConfigurationJson[] | undefined;
  }> {
    // Retrieve record
    const accountCrmWithCrmAndSecretReferences: unknown =
      typeof input === 'string'
        ? await this.accountIntegrationDbHandler.retrieveAccountCrmById(input, {
            crm: true,
            crmSecretRefs: true,
          })
        : input;
    if (!accountCrmWithCrmAndSecretReferences) {
      throw new NotFoundException('No record found');
    }

    // Validate shape
    if (
      !validateAccountCrmWithCrmAndSecretReferences(
        accountCrmWithCrmAndSecretReferences,
      )
    ) {
      const err = new UnprocessableEntityException(
        'Record did not match expected data shape',
      );
      Sentry.withScope((scope) => {
        scope.setExtras({
          errors: validateAccountCrmWithCrmAndSecretReferences.errors,
          inputType: typeof input,
        });
        Sentry.captureException(err);
      });
      throw err;
    }

    // Validate ownership
    if (accountCrmWithCrmAndSecretReferences.accountId !== tokenAccountId) {
      const err = new UnauthorizedException();
      Sentry.withScope((scope) => {
        scope.setExtras({
          accountCrmId: input,
          accountId: tokenAccountId,
          userId,
        });
        Sentry.captureException(err);
      });
      throw err;
    }

    // Check configuration
    const nonSensitiveConfigKeys: string[] =
      accountCrmWithCrmAndSecretReferences.nonSensitiveCredentials
        ? Object.keys(
            accountCrmWithCrmAndSecretReferences.nonSensitiveCredentials,
          )
        : [];
    const missingConfigs: IAccountIntegrationFieldConfigurationJson[] =
      missingConfigCheck(
        accountCrmWithCrmAndSecretReferences.crm.configurationTemplate,
        accountCrmWithCrmAndSecretReferences.crmSecretRefs,
        nonSensitiveConfigKeys,
      );

    const result: {
      isFullyConfigured: boolean;
      missingConfigs?: IAccountIntegrationFieldConfigurationJson[];
    } = {
      isFullyConfigured: missingConfigs.length === 0,
    };
    if (missingConfigs.length > 0) {
      result.missingConfigs = missingConfigs;
    }
    return result;
  }

  async createAccountIntegration(
    integrationType: AccountIntegrationType,
    integrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    if (
      !this.accountPermissionService.doesUserHavePermission(
        requesterId,
        accountId,
        'EDIT_ACCOUNT_INTEGRATIONS',
      )
    ) {
      throw new UnauthorizedException();
    }

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.create(integrationId, accountId);
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type.');
    }
  }

  async updateAccountIntegrationConfig(
    integrationType: AccountIntegrationType,
    integrationId: string,
    accountId: string,
    requesterId: string,
    config: Record<string, any>,
  ) {
    if (
      !this.accountPermissionService.doesUserHavePermission(
        requesterId,
        accountId,
        'EDIT_ACCOUNT_INTEGRATION_CONFIGURATION',
      )
    ) {
      throw new UnauthorizedException();
    }

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.updateConfig(
          integrationId,
          accountId,
          config,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }
}
