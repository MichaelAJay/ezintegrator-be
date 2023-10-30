import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { UserDbQueryBuilderService } from './user.db-query-builder.service';
import {
  ICreateUserDbQueryBuilderArgs,
  IUpdateUserDbQueryBuilderArgs,
  IUserDbHandler,
} from '.';

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
  async retrieveById(id: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    hashedPassword: string;
    hashedRt: string | null;
    salt: string;
    accountId: string;
  } | null> {
    const query = this.queryBuilder.buildFindUniqueByIdQuery(id);
    return this.dbClient.user.findUnique(query);
  }
  async retrieveByEmail(email: string) {
    const query = this.queryBuilder.buildFindUniqueByEmailQuery(email);
    return this.dbClient.user.findUnique(query);
  }
  async update(userId: string, args: IUpdateUserDbQueryBuilderArgs) {
    const query = this.queryBuilder.buildUpdateQuery(userId, args);
    return this.dbClient.user.update(query);
  }
}
