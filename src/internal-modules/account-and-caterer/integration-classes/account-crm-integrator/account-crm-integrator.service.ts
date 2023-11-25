import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AccountCrm, AccountCrmSecretReference, Crm } from '@prisma/client';
import * as Sentry from '@sentry/node';
import { AccountSecretDbHandlerService } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-secret.db-handler.service';
import { ValidationError } from '../../../../common/errors/validation-error';
import { AccountSecretReferenceSecretTypeValues } from '../../../../external-modules';
import { SecretManagerService } from '../../../../external-modules/secret-manager/secret-manager.service';
import { AccountIntegrationDbHandlerService } from '../../../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountIntegrationHelperService } from '../../account-integration-helper/account-integration-helper.service';
import { AccountIntegrationMapperService } from '../../account-integration-helper/account-integration-mapper.service';
import { prepareAccountIntegrationConfigurationUpdate } from '../../utility/account-integration/prepare-configuration-update.utility-function';
import { validateExistingSecrets } from '../../validators/account-integration-existing-secrets.schema-and-validator';
import { IAccountIntegrationClass } from '../account-integration.class-interface';

@Injectable()
export class AccountCrmIntegratorService implements IAccountIntegrationClass {
  constructor(
    private readonly accountIntegrationMapper: AccountIntegrationMapperService,
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly secretManagerService: SecretManagerService,
    private readonly accountSecretDbHandler: AccountSecretDbHandlerService,
    private readonly accountIntegrationHelper: AccountIntegrationHelperService,
  ) {}

  async create(crmId: string, accountId: string): Promise<any> {
    // The FK constraint is handled at the DB level, but should probably be managed here.
    const result = await this.accountIntegrationDbHandler.addAccountCrm({
      accountId,
      crmId,
    });

    return result;
  }
  async retrieveOne(
    accountCrmId: string,
    requester: { accountId: string; userId: string },
  ) {
    const accountCrm =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountCrmId,
        {
          integration: {
            include: {
              validEventProcesses: true,
            },
          },
          secretRefs: true,
          eventProcesses: true,
        },
      );

    if (!accountCrm) {
      throw new NotFoundException();
    }

    return accountCrm;
  }
  async retrieveAll(accountId: string) {
    return this.accountIntegrationDbHandler.retrieveAccountCrms(accountId);
  }
  async retrieveGeneralizedAccountIntegration(accountIntegrationId: string) {
    type AccountCrmWithCrmAndSecretRefs = AccountCrm & {
      crm: Crm;
      secretRefs: Array<AccountCrmSecretReference>;
    };

    /**
     * @TODO GET RID OF THIS TYPE
     */
    const accountIntegration: AccountCrmWithCrmAndSecretRefs =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountIntegrationId,
        {
          integration: { include: { validEventProcesses: true } },
          secretRefs: true,
        },
      );

    if (!accountIntegration) {
      throw new NotFoundException('Record not found');
    }

    // Generalize result
    const generalizedAccountIntegration =
      this.accountIntegrationMapper.mapAccountIntegrationForConfig(
        accountIntegration,
        'CRM',
      );
    return { accountIntegration, generalizedAccountIntegration };
  }
  update(args: any) {
    throw new Error('Method not implemented.');
  }

  async updateConfig(
    accountIntegrationId: string,
    requester: { accountId: string; userId: string },
    configUpdate: Record<string, any>,
  ) {
    // Generalize result
    let { accountIntegration, generalizedAccountIntegration } =
      await this.retrieveGeneralizedAccountIntegration(accountIntegrationId);

    /**
     * @check — the target accountIntegration belongs to the same account as the requesting user
     */
    if (generalizedAccountIntegration.accountId !== requester.accountId) {
      throw new ConflictException();
    }

    // Get validated updates
    const { secrets, nonSensitiveCredentials, invalidFields } =
      prepareAccountIntegrationConfigurationUpdate(
        generalizedAccountIntegration.integration,
        configUpdate,
      );

    const updatedNonSensitiveCredentials = {
      ...(accountIntegration.nonSensitiveCredentials as object),
      ...nonSensitiveCredentials,
    };

    // This is working as intended
    // Should probably confirm it's required
    await this.accountIntegrationDbHandler.updateAccountCrm(
      accountIntegrationId,
      requester.accountId,
      { nonSensitiveCredentials: updatedNonSensitiveCredentials },
    );

    const secretsResult = await this.handleSecretsUpdate(
      accountIntegrationId,
      accountIntegration.secretRefs,
      secrets,
    );

    const afterUpdateResult = await this.retrieveGeneralizedAccountIntegration(
      accountIntegrationId,
    );

    accountIntegration = afterUpdateResult.accountIntegration;
    generalizedAccountIntegration =
      afterUpdateResult.generalizedAccountIntegration;

    // If fully configured, update accountIntegration record
    const { isFullyConfigured, missingConfigs } =
      this.accountIntegrationHelper.getAccountIntegrationConfigStatusAndMissingValues(
        generalizedAccountIntegration,
      );
    if (isFullyConfigured && !accountIntegration.isConfigured) {
      await this.accountIntegrationDbHandler.updateAccountCrm(
        accountIntegrationId,
        requester.accountId,
        { isConfigured: true },
      );
      // Assumes reliability of above update operation - parity is always checked before "isActive" is set to true
      accountIntegration.isConfigured = true;
    }

    return {
      accountIntegration,
      result: { secrets, nonSensitiveCredentials, invalidFields }, // This should go away once the testing is done
    };
  }

  async deactivate(accountIntegrationId: string, accountId: string) {
    return this.accountIntegrationDbHandler.updateAccountCrm(
      accountIntegrationId,
      accountId,
      {
        isActive: false,
      },
    );
  }
  async activate(accountIntegrationId: string, accountId: string) {
    /**
     * @check — accountIntegration isConfigured
     */
    const accountIntegration =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountIntegrationId,
      );
    if (!accountIntegration.isConfigured) {
      if (accountIntegration.isActive) {
        // This shouldn't be happening - it should deactivate and throw an error
      } else {
        throw new UnprocessableEntityException(
          'The account integration is not fully configured.',
        );
      }
    }

    return this.accountIntegrationDbHandler.updateAccountCrm(
      accountIntegrationId,
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
  async delete(accountIntegrationId: string, accountId: string) {
    // Get record - make sure that it's inactive & belongs to the specified account
    const accountCrm =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountIntegrationId,
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
        accountIntegrationId,
      );
    // Delete account integration & all reference records
    await this.accountIntegrationDbHandler.deleteAccountIntegration(
      'CRM',
      accountIntegrationId,
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

  async handleSecretsUpdate(
    accountIntegrationId: string,
    existingSecrets: any,
    incomingSecrets: Array<{
      type: AccountSecretReferenceSecretTypeValues;
      secret: any;
    }>,
  ) {
    try {
      /**
       * @check — existingSecrets is an array and every elemeht is an object with "secretName" and "type" properties
       */
      if (!validateExistingSecrets(existingSecrets)) {
        throw new ValidationError(
          'existingSecrets validation failed',
          validateExistingSecrets.errors,
        );
      }

      const promiseAllResult = await Promise.all(
        incomingSecrets.map(async (secret) => {
          const existingSecret = existingSecrets.find(
            (secretRef) => secretRef.type === secret.type,
          );
          if (existingSecret) {
            // Disable the old secret
            return this.secretManagerService.upsertSecretVersion(
              existingSecret.secretName,
              secret.secret,
            );
          } else {
            // Create
            return this.accountSecretDbHandler
              .createAccountCrmSecretReference({
                accountCrmId: accountIntegrationId,
                type: secret.type,
              })
              .then((result) =>
                this.secretManagerService.upsertSecretVersion(
                  result.secretName,
                  secret.secret,
                ),
              );
          }
        }),
      );
      return promiseAllResult;
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      throw err;
    }
  }

  async checkConfigurationExternally(): Promise<boolean> {
    return false;
  }
}
