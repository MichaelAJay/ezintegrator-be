import {
  BadRequestException,
  ConflictException,
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
import { PermissionNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';

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
        return this.accountCrmIntegrator.create(integrationId, accountId);
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type.');
    }
  }

  async updateAccountIntegrationConfig(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
    config: Record<string, any>,
  ) {
    await this.confirmRequesterCanCarryOutAccountIntegrationAction(
      { id: requesterId, accountId },
      integrationType,
      accountIntegrationId,
      'EDIT_ACCOUNT_INTEGRATION_CONFIGURATION',
    );

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.updateConfig(
          accountIntegrationId,
          accountId,
          config,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async deactivate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    await this.confirmRequesterCanCarryOutAccountIntegrationAction(
      { id: requesterId, accountId },
      integrationType,
      accountIntegrationId,
      'EDIT_ACCOUNT_INTEGRATIONS',
    );

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.deactivate(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async activate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    await this.confirmRequesterCanCarryOutAccountIntegrationAction(
      { id: requesterId, accountId },
      integrationType,
      accountIntegrationId,
      'EDIT_ACCOUNT_INTEGRATIONS',
    );

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.activate(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  /**
   * @throws NotFoundException (record not found)
   * @throws ConflictException (record account doesn't match user account)
   * @throws UnprocessableEntityException (record is active)
   * @throws UnprocessableEntityException (record missing accountId)
   * @throws UnauthorizedException (requester lacks permission)
   */
  async delete(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ) {
    await this.confirmRequesterCanCarryOutAccountIntegrationAction(
      { id: requesterId, accountId },
      integrationType,
      accountIntegrationId,
      'EDIT_ACCOUNT_INTEGRATIONS',
    );

    switch (integrationType) {
      case 'CRM':
        return this.accountCrmIntegrator.delete(
          accountIntegrationId,
          accountId,
        );
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }
  }

  async getAccountIntegrationConfiguration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requesterAccountId: string,
    requesterId: string,
  ) {}

  async getAccountIntegrationConfigurations(
    requesterId: string,
    requesterAccountId: string,
    integrationType?: AccountIntegrationType,
  ) {
    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requesterId,
        requesterAccountId,
        'EDIT_ACCOUNT_INTEGRATION_CONFIGURATION',
      ))
    ) {
      throw new UnauthorizedException();
    }
  }

  // Helper

  /**
   * Ensures that requester's account matches the integration's account
   * And that the requester has adequate permission on the account to carry out the action
   *
   * @throws NotFoundException (record not found by id)
   * @throws UnprocessableEntityException (record missing accountId)
   * @throws ConflictException (record and user do not share the same account)
   * @throws UnauthorizedException (requester lacks permission)
   */
  async confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    permission: PermissionNameValue,
  ) {
    if (
      !(await this.accountIntegrationBelongsToUserAccount(
        requester.accountId,
        integrationType,
        accountIntegrationId,
      ))
    ) {
      throw new ConflictException();
    }

    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requester.id,
        requester.accountId,
        permission,
      ))
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * @throws NotFoundException (record not found by id)
   * @throws UnprocessableEntityException (record missing accountId)
   */
  async accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
  ) {
    let record: any;
    switch (integrationType) {
      case 'CRM':
        record = await this.accountCrmIntegrator.retrieveOne(
          accountIntegrationId,
        );

        break;
      default:
        Sentry.captureMessage('Invalid integration type passed in', 'error');
        throw new BadRequestException('Invalid integration type');
    }

    if (!record) {
      throw new NotFoundException();
    }

    if (!record.accountId) {
      const err = new UnprocessableEntityException();
      Sentry.withScope((scope) => {
        scope.setExtra('id', accountIntegrationId);
        Sentry.captureException(err);
      });
      throw err;
    }

    return requesterAccountId === record.accountId;
  }
}
