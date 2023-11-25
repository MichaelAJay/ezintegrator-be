import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  IAccountIntegrationFieldConfigurationJson,
  IAccountIntegrationHelper,
} from '../interfaces';
import * as Sentry from '@sentry/node';
import { PermissionNameValue } from '../../../external-modules/db-client/models/role-and-permission.db-models';
import { AccountPermissionService } from '../../security-utility/account-permission.service';
import {
  IAccountIntegrationWithConfigAndSystemIntegration,
  IFullAccountIntegration,
} from '../interfaces/account-integration.interface';
import { AccountSecretReferenceSecretTypeValues } from '../../../external-modules';
import { IGetAccountIntegrationConfigStatusAndMissingValues } from '../interfaces/method-returns';

/**
 * This is a helper service for AccountIntegrationService
 * !!! IT SHOULD NOT BE IMPORTED INTO ANY SERVICE EXCEPTION AccountIntegrationService
 */
@Injectable()
export class AccountIntegrationHelperService
  implements IAccountIntegrationHelper
{
  constructor(
    private readonly accountPermissionService: AccountPermissionService,
  ) {}

  async confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    record: IFullAccountIntegration,
    permission: PermissionNameValue,
  ) {
    if (
      !(await this.accountIntegrationBelongsToUserAccount(
        requester.accountId,
        record,
      ))
    ) {
      throw new ConflictException();
    }

    if (
      !(await this.accountPermissionService.doesUserHavePermission(
        requester.id,
        permission,
      ))
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    record: IFullAccountIntegration,
  ) {
    if (!record.accountId) {
      const err = new UnprocessableEntityException();
      Sentry.withScope((scope) => {
        scope.setExtra('id', record.id);
        Sentry.captureException(err);
      });
      throw err;
    }

    return requesterAccountId === record.accountId;
  }

  getAccountIntegrationConfigStatusAndMissingValues(
    accountIntegration: IAccountIntegrationWithConfigAndSystemIntegration,
  ): IGetAccountIntegrationConfigStatusAndMissingValues {
    const configFromSystem =
      accountIntegration.integration.configurationTemplate;
    const missingConfigs: Array<IAccountIntegrationFieldConfigurationJson> = [];
    for (const config of configFromSystem) {
      if (config.isSecret) {
        const matchingSecret = accountIntegration.secretRefs.includes(
          config.fieldName as AccountSecretReferenceSecretTypeValues,
        );
        if (!matchingSecret) {
          missingConfigs.push(config);
        }
      } else {
        if (
          !(
            accountIntegration.nonSensitiveCredentials &&
            accountIntegration.nonSensitiveCredentials.hasOwnProperty(
              config.fieldName,
            )
          )
        ) {
          missingConfigs.push(config);
        }
      }
    }

    const result: any = {
      isFullyConfigured: missingConfigs.length === 0,
    };
    if (missingConfigs.length > 0) {
      result.missingConfigs = missingConfigs;
    }
    return result;
  }
}
