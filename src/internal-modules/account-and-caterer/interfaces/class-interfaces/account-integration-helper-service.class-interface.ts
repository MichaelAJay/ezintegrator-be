import { IAccountIntegrationFieldConfigurationJson } from '..';
import { PermissionNameValue } from '../../../../external-modules/db-client/models/role-and-permission.db-models';
import { AccountIntegrationType } from '../../types';
import { IAccountIntegration } from '../account-integration.interface';

export interface IAccountIntegrationHelper {
  confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    permission: PermissionNameValue,
  ): Promise<boolean>;

  /**
   * @TODO - send in the record instead
   * @NOTE this should be the generalized record
   */
  accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    record: IAccountIntegration,
  ): Promise<boolean>;

  getAccountIntegrationConfigStatusAndMissingValues(
    accountIntegration: IAccountIntegration,
    configFromSystem: Array<IAccountIntegrationFieldConfigurationJson>,
  ): any;
}