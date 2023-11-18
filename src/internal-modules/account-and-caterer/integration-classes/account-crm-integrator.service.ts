import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SecretManagerService } from '../../../external-modules/secret-manager/secret-manager.service';
import { AccountIntegrationDbHandlerService } from '../../../internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { IAccountIntegrationClass } from './account-integration.class-interface';
import * as Sentry from '@sentry/node';
import { generalizeCreateAccountCrmIntegrationResult } from './utility/generalized-create-integration-converter.utility-function';
import {
  IAccountIntegrationFieldConfigurationJson,
  ICreateAccountIntegrationReturn,
} from '../interfaces';
import { validateAccountCrmWithCrmAndSecretReferences } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-crm-with-crm-and-secret-refs.schema-and-validator';
import { missingConfigCheck } from '../utility/account-integration/missing-config-check.account-integration-utility-function';

@Injectable()
export class AccountCrmIntegratorService implements IAccountIntegrationClass {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly secretManagerService: SecretManagerService,
  ) {}

  async create(
    crmId: string,
    accountId: string,
  ): Promise<ICreateAccountIntegrationReturn> {
    // The FK constraint is handled at the DB level, but should probably be managed here.
    const result = await this.accountIntegrationDbHandler.addAccountCrm({
      accountId,
      crmId,
    });

    const generalizedResult =
      generalizeCreateAccountCrmIntegrationResult(result);
    return generalizedResult;
  }
  async retrieveOne(
    accountCrmId: string,
    requester: { accountId: string; userId: string },
  ) {
    const accountCrm =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountCrmId,
        {
          crm: {
            include: {
              validEventProcesses: true,
            },
          },
          secretRefs: true,
        },
      );

    if (!accountCrm) {
      throw new NotFoundException();
    }

    // Validates result
    // Confirms that accountCrm belongs to token's accountId
    // Reports whether crm is fully configured, and if not, what's missing
    const isAccountCrmFullyConfigured =
      await this.isAccountIntegrationFullyConfigured(accountCrm, requester);

    return { ...isAccountCrmFullyConfigured, integration: accountCrm };
  }
  async retrieveAll(accountId: string) {
    return this.accountIntegrationDbHandler.retrieveAccountCrms(accountId);
  }
  update(args: any) {
    throw new Error('Method not implemented.');
  }
  async updateConfig(
    integrationId: string,
    accountId: string,
    config: Record<string, any>,
  ) {
    // Retrieve integration by id - include what it references (for instance, Nutshell CRM)
    // Validate the incoming config against the expected config
    // Thoughts on how this update works:
    // 1) It doesn't need to be include all properties.  Missing properties from the config are assumed to represent no change
    // Downside:  If a user just wants to get rid of some information, this won't do it.  But they could just destroy the whole integration
    // 2) Whatever IS included in the config will overwrite anything already stored
    // 3) A check is (?always) performed to determine if the integration's configuration is complete
    // 4) The remaining configuration keys to include are returned, if they exist
  }

  async deactivate(integrationId: string, accountId: string) {
    return this.accountIntegrationDbHandler.updateAccountCrm(
      integrationId,
      accountId,
      {
        isActive: false,
      },
    );
  }
  async activate(integrationId: string, accountId: string) {
    return this.accountIntegrationDbHandler.updateAccountCrm(
      integrationId,
      accountId,
      {
        isActive: true,
      },
    );
  }

  /**
   * @throws NotFoundException (record not found)
   * @throws ConflictException (record account doesn't match user account)
   * @throws UnprocessableEntityException (record is active)
   */
  async delete(accountCrmId: string, accountId: string) {
    // Get record - make sure that it's inactive & belongs to the specified account
    const accountCrm =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountCrmId,
      );

    if (!accountCrm) {
      throw new NotFoundException();
    }
    if (accountCrm.accountId !== accountId) {
      throw new ConflictException();
    }
    if (accountCrm.isActive) {
      throw new UnprocessableEntityException(
        'Integration must be deactivated before deletion.',
      );
    }

    // Retrieve all crm secret references
    const secretReferences =
      await this.accountIntegrationDbHandler.retrieveAllTargetAccountIntegrationSecretReferences(
        'CRM',
        accountCrmId,
      );
    // Delete account integration & all reference records
    await this.accountIntegrationDbHandler.deleteAccountIntegration(
      'CRM',
      accountCrmId,
    );

    // Delete all secrets
    if (secretReferences.length > 0) {
      const undeletedSecretNames: string[] = [];
      await Promise.allSettled(
        secretReferences.map((secretRef) =>
          this.secretManagerService.deleteSecret(secretRef.secretName),
        ),
      ).then((results) => {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            undeletedSecretNames.push(secretReferences[index].secretName);
          }
        });
      });
      if (undeletedSecretNames.length > 0) {
        Sentry.withScope((scope) => {
          scope.setExtras({
            names: undeletedSecretNames.join(', '),
          });
          Sentry.captureMessage('PROMISE.ALLSETTLED REJECTS');
        });
        console.error(
          'UNDELETED SECRET NAMES',
          undeletedSecretNames.join(', '),
        );
      }
    }

    // Log event?

    // Return
    return;
  }

  async isAccountIntegrationFullyConfigured(
    input: string | unknown,
    requester: { userId: string; accountId: string },
  ): Promise<{
    isFullyConfigured: boolean;
    missingConfigs?: IAccountIntegrationFieldConfigurationJson[] | undefined;
  }> {
    // Retrieve record
    const accountCrmWithCrmAndSecretReferences: unknown =
      typeof input === 'string'
        ? await this.accountIntegrationDbHandler.retrieveAccountCrmById(input, {
            crm: true,
            secretRefs: true,
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
    if (
      accountCrmWithCrmAndSecretReferences.accountId !== requester.accountId
    ) {
      const err = new UnauthorizedException();
      Sentry.withScope((scope) => {
        scope.setExtras({
          accountCrmId: input,
          accountId: requester.accountId,
          userId: requester.userId,
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

  /**
   * *************************
   * *** SECRET MANAGEMENT ***
   * *************************
   */
  async addIntegrationSecret() {}
}
