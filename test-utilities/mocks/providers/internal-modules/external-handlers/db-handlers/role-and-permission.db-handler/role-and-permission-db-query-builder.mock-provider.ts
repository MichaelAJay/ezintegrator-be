import { IRoleAndPermissionDbQueryBuilderProvider } from 'src/internal-modules/external-handlers/db-handlers/role-and-permission.db-handler/interfaces/class-interfaces';

export const mockRoleAndPermissionDbQueryBuilder: IRoleAndPermissionDbQueryBuilderProvider =
  {
    buildRetrieveRoleByNameQuery: jest.fn(),
  };
