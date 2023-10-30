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

  create(args: ICreateUserDbQueryBuilderArgs) {
    const query = this.queryBuilder.buildCreateQuery(args);
    return this.dbClient.user.create(query);
  }
  retrieveByEmail() {
    throw new Error('Method not implemented.');
  }
  update(userId: string, args: IUpdateUserDbQueryBuilderArgs) {
    const query = this.queryBuilder.buildUpdateQuery(userId, args);
    return this.dbClient.user.update(query);
  }
}
