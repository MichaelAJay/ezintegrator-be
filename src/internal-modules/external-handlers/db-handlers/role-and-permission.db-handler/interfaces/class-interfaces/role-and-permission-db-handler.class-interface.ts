import { RoleNameValue } from '../../../../../../external-modules/db-client/models/role-and-permission.db-models';

export interface IRoleAndPermissionDbHandlerProvider {
  retrieveRoleByName(roleName: RoleNameValue): Promise<any>;
}
