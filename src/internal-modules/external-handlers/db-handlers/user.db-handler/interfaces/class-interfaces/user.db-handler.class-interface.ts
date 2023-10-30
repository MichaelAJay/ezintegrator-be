import { ICreateUserDbQueryBuilderArgs } from '../create-user.db-query-builder.args-interface';
import { IUpdateUserDbQueryBuilderArgs } from '../update-user.db-query-builder.args-interface';

export interface IUserDbHandler {
  create(args: ICreateUserDbQueryBuilderArgs): any;
  retrieveByEmail(): any;
  update(userId: string, args: IUpdateUserDbQueryBuilderArgs): any;
}
