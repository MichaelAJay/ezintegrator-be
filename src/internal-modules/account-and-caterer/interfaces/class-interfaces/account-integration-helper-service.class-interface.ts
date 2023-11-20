import { IAccountIntegrationFieldConfigurationJson } from '..';
import { PermissionNameValue } from '../../../../external-modules/db-client/models/role-and-permission.db-models';
import { IFullAccountIntegration } from '../account-integration.interface';

export interface IAccountIntegrationHelper {
  confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    record: IFullAccountIntegration,
    permission: PermissionNameValue,
  ): Promise<boolean>;

  /**
   * @TODO - send in the record instead
   * @NOTE this should be the generalized record
   */
  accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    record: IFullAccountIntegration,
  ): Promise<boolean>;

  getAccountIntegrationConfigStatusAndMissingValues(
    accountIntegration: IFullAccountIntegration,
    configFromSystem: Array<IAccountIntegrationFieldConfigurationJson>,
  ): any;
}
