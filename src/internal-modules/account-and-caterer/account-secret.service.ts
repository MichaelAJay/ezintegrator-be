import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SecretManagerService } from '../../external-modules/secret-manager/secret-manager.service';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountSecretDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-secret.db-handler.service';
import { AccountPermissionService } from '../security-utility/account-permission.service';
import { AccountIntegrationService } from './account-integration.service';
import { IAccountSecretProvider, IAddCrmSecretArgs } from './interfaces';
import { IAccountIntegrationFieldConfigurationJson } from './interfaces/account-integration-fields.json-interface';

@Injectable()
export class AccountSecretService implements IAccountSecretProvider {
  constructor(
    private readonly accountPermissionService: AccountPermissionService,
    private readonly accountSecretDbHandler: AccountSecretDbHandlerService,
    private readonly secretManagerService: SecretManagerService,
    private readonly accountIntegrationService: AccountIntegrationService,
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
  ) {}

  async addCrmSecret(
    secret: IAddCrmSecretArgs,
    userId: string,
    accountId: string,
  ): Promise<{
    message: string;
    missingConfigs?: IAccountIntegrationFieldConfigurationJson[];
  }> {
    // VALIDATION
    // 1) Confirm that the target accountCrm exists
    const accountCrm =
      await this.accountIntegrationDbHandler.retrieveAccountCrmById(
        secret.accountIntegrationId,
      );
    if (!accountCrm) {
      throw new NotFoundException("The secret's target was not found.");
    }
    if (accountCrm.accountId !== accountId) {
      throw new ConflictException(
        "The secret's target does not belong to the requester's account.",
      );
    }

    // 2) Confirm that the requesting user has permission to add a secret
    await this.accountPermissionService.canUserEditSecretsForAccount(
      accountId,
      userId,
    );

    // Create secret reference
    const { secretName } =
      await this.accountSecretDbHandler.createAccountCrmSecretReference({
        type: secret.secretType,
        accountCrmId: secret.accountIntegrationId,
      });

    // Add secret to secret manager
    await this.secretManagerService.upsertSecretVersion(
      secretName,
      secret.secret,
    );

    // 3) Check if AccountCrm is now fully configured and update if so
    const { isFullyConfigured, missingConfigs } =
      await this.accountIntegrationService.isAccountCrmFullyConfigured(
        accountCrm.id,
        accountId,
        userId,
      );
    if (isFullyConfigured) {
      if (!accountCrm.isConfigured) {
        await this.accountIntegrationDbHandler.updateAccountCrm(
          accountCrm.id,
          accountId,
          {
            isConfigured: true,
          },
        );
      }
      return { message: 'The CRM integration is complete and ready to use!' };
    }

    return {
      message: 'Finish the CRM configuration by including all required values.',
      missingConfigs,
    };
  }
}
