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
import { prepareAccountIntegrationConfigurationUpdate } from '../../utility/account-integration/prepare-configuration-update.utility-function';
import { validateExistingSecrets } from '../../validators/account-integration-existing-secrets.schema-and-validator';
import { AccountIntegrationMapperService } from '../account-integration-mapper.service';
import { IAccountIntegrationClass } from '../account-integration.class-interface';

@Injectable()
export class AccountCrmIntegratorService implements IAccountIntegrationClass {
  constructor(
    private readonly accountIntegrationMapper: AccountIntegrationMapperService,
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
    private readonly secretManagerService: SecretManagerService,
    private readonly accountSecretDbHandler: AccountSecretDbHandlerService,
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
  update(args: any) {
    throw new Error('Method not implemented.');
  }

  async updateConfig(
    accountIntegrationId: string,
    requesterAccountId: string,
    configUpdate: Record<string, any>,
  ) {
    type AccountCrmWithCrmAndSecretRefs = AccountCrm & {
      crm: Crm;
      secretRefs: Array<AccountCrmSecretReference>;
    };

    /**
     * @TODO GET RID OF THIS TYPE
     */
    const accountCrm: AccountCrmWithCrmAndSecretRefs =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        accountIntegrationId,
        {
          integration: { include: { validEventProcesses: true } },
          secretRefs: true,
        },
      );

    if (!accountCrm) {
      throw new NotFoundException('Record not found');
    }

    // Generalize result
    const accountIntegration =
      this.accountIntegrationMapper.mapAccountIntegrationForConfig(
        accountCrm,
        'CRM',
      );

    /**
     * @check — the target accountIntegration belongs to the same account as the requesting user
     */
    if (accountIntegration.accountId !== requesterAccountId) {
      throw new ConflictException();
    }

    // Get validated updates
    const { secrets, nonSensitiveCredentials, invalidFields } =
      prepareAccountIntegrationConfigurationUpdate(
        accountIntegration.integration,
        configUpdate,
      );

    const updatedNonSensitiveCredentials = {
      ...(accountCrm.nonSensitiveCredentials as object),
      ...nonSensitiveCredentials,
    };

    return { secrets, updatedNonSensitiveCredentials, invalidFields };

    // const secretsResult = await this.handleSecretsUpdate(
    //   accountIntegrationId,
    //   accountCrm.secretRefs,
    //   secrets,
    // );
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
      Sentry.captureException(err);
      throw err;
    }
  }
}
