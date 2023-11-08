import { PermissionNameValue } from '../../../../external-modules/db-client/models/role-and-permission.db-models';

export interface IAccountPermissionProvider {
  canUserEditSecretsForAccount(
    accountId: string,
    userId: string,
  ): Promise<boolean>;
  doesUserHavePermission(
    userId: string,
    accountId: string,
    permissionName: PermissionNameValue,
  ): Promise<boolean>;
}
