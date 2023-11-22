import { IAccountIntegrationFieldConfigurationJson } from '..';
import { PermissionNameValue } from '../../../../external-modules/db-client/models/role-and-permission.db-models';
import { IFullAccountIntegration } from '../account-integration.interface';
import { IGetAccountIntegrationConfigStatusAndMissingValues } from '../method-returns';

export interface IAccountIntegrationHelper {
  /**
   * @check requester's account matches integration's account
   * @check requester has adequate permission to carry out action
   * @throws NotFoundException (record not found by id)
   * @throws UnprocessableEntityException (record missing accountId)
   * @throws ConflictException (record and user do not share the same account)
   * @throws UnauthorizedException (requester lacks permission)
   */
  confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    record: IFullAccountIntegration,
    permission: PermissionNameValue,
  ): Promise<boolean>;

  /**
   * @throws NotFoundException (record not found by id)
   * @throws UnprocessableEntityException (record missing accountId)
   */
  accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    record: IFullAccountIntegration,
  ): Promise<boolean>;

  getAccountIntegrationConfigStatusAndMissingValues(
    accountIntegration: IFullAccountIntegration,
    configFromSystem: Array<IAccountIntegrationFieldConfigurationJson>,
  ): IGetAccountIntegrationConfigStatusAndMissingValues;
}
