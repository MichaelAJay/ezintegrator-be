import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoleNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
import { IRoleAndPermissionDbQueryBuilderProvider } from './interfaces/class-interfaces';

@Injectable()
export class RoleAndPermissionDbQueryBuilderService
  implements IRoleAndPermissionDbQueryBuilderProvider
{
  buildRetrieveRoleByNameQuery(
    roleName: RoleNameValue,
  ): Prisma.RoleFindUniqueArgs {
    return {
      where: { name: roleName },
    };
  }
}
