import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { UserDbQueryBuilderService } from './user.db-query-builder.service';
import {
  ICreateUserDbQueryBuilderArgs,
  IUpdateUserDbQueryBuilderArgs,
  IUserDbHandler,
} from '.';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserDbHandlerService implements IUserDbHandler {
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: UserDbQueryBuilderService,
  ) {}

  async create(args: ICreateUserDbQueryBuilderArgs) {
    const query = this.queryBuilder.buildCreateQuery(args);
    return this.dbClient.user.create(query);
  }

  // BE CAREFUL NOT TO LEAK SALT, HASHEDPASSWORD, HASHEDRT
  async retrieveById(
    id: string,
    include?: Prisma.UserInclude,
  ): Promise<User | null> {
    const query = this.queryBuilder.buildFindUniqueByIdQuery(id, include);
    const result = this.dbClient.user.findUnique(query);
    return result;
  }
  async retrieveByEmail(email: string) {
    const query = this.queryBuilder.buildFindUniqueByEmailQuery(email);
    return this.dbClient.user.findUnique(query);
  }
  async update(userId: string, args: IUpdateUserDbQueryBuilderArgs) {
    const query = this.queryBuilder.buildUpdateQuery(userId, args);
    return this.dbClient.user.update(query);
  }

  // Permissions
  async retrieveUserPermissions(userId: string): Promise<unknown> {
    const query = this.queryBuilder.buildRetrieveUserPermissionsQuery(userId);
    return this.dbClient.user.findUnique(query);
  }
}
