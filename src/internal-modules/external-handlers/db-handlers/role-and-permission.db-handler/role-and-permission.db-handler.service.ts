import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { RoleNameValue } from '../../../../external-modules/db-client/models/role-and-permission.db-models';
import { IRoleAndPermissionDbHandlerProvider } from './interfaces/class-interfaces';
import { RoleAndPermissionDbQueryBuilderService } from './role-and-permission.db-query-builder.service';

@Injectable()
export class RoleAndPermissionDbHandlerService
  implements IRoleAndPermissionDbHandlerProvider
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: RoleAndPermissionDbQueryBuilderService,
  ) {}

  async retrieveRoleByName(roleName: RoleNameValue): Promise<any> {
    const query = this.queryBuilder.buildRetrieveRoleByNameQuery(roleName);
    return this.dbClient.role.findUnique(query);
  }
}
