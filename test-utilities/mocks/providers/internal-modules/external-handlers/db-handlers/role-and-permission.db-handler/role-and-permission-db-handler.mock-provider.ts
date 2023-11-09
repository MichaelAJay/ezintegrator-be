import { IRoleAndPermissionDbHandlerProvider } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/role-and-permission.db-handler/interfaces/class-interfaces';

export const mockRoleAndPermissionDbHandlerService: IRoleAndPermissionDbHandlerProvider =
  {
    retrieveRoleByName: jest.fn(),
  };
