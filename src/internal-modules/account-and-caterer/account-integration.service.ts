import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAccountIntegrationProvider } from './interfaces';
import { IAccountIntegrationFieldConfigurationJson } from './interfaces/account-integration-fields.json-interface';
import * as Sentry from '@sentry/node';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { validateAccountCrmWithCrmAndSecretReferences } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-crm-with-crm-and-secret-refs.schema-and-validator';
import { AccountIntegrationType } from './types';
import { missingConfigCheck } from './utility/account-integration/missing-config-check.account-integration-utility-function';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';

// MAY NOT INJECT:
// AccountSecretService
@Injectable()
export class AccountIntegrationService implements IAccountIntegrationProvider {
  constructor(
    private readonly accountIntegrationDbhandler: AccountIntegrationDbHandlerService,
  ) {}

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
          await this.accountIntegrationDbhandler.retrieveAccountCrmById(
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

  async getAccountIntegrations() {}

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
        ? await this.accountIntegrationDbhandler.retrieveAccountCrmById(input, {
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
  ) {
    switch (integrationType) {
      case 'CRM':
        return;
      default:
        throw new UnprocessableEntityException('Invalid integration type.');
    }
  }
}
