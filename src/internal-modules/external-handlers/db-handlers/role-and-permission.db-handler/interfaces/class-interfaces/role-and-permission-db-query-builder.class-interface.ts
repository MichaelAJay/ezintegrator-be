import { Prisma } from '@prisma/client';

export interface IRoleAndPermissionDbQueryBuilderProvider {
  buildRetrieveRoleByNameQuery(roleName: string): Prisma.RoleFindUniqueArgs;
}
