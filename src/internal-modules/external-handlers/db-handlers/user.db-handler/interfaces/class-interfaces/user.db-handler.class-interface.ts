import { ICreateUserDbQueryBuilderArgs } from '../create-user.db-query-builder.args-interface';
import { IUpdateUserDbQueryBuilderArgs } from '../update-user.db-query-builder.args-interface';

export interface IUserDbHandler {
  create(args: ICreateUserDbQueryBuilderArgs): any;
  retrieveById(id: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    hashedPassword: string;
    hashedRt: string | null;
    salt: string;
    accountId: string;
  } | null>;
  retrieveByEmail(email: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    hashedPassword: string;
    hashedRt: string | null;
    salt: string;
    accountId: string;
  } | null>;
  update(userId: string, args: IUpdateUserDbQueryBuilderArgs): any;
}
