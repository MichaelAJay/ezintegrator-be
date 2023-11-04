import { Prisma, User } from '@prisma/client';
import { ICreateUserDbQueryBuilderArgs } from '../create-user.db-query-builder.args-interface';
import { IUpdateUserDbQueryBuilderArgs } from '../update-user.db-query-builder.args-interface';

export interface IUserDbHandler {
  create(args: ICreateUserDbQueryBuilderArgs): any;
  retrieveById(id: string, include?: Prisma.UserInclude): Promise<User | null>;
  retrieveByEmail(
    email: string,
  ): Promise<Omit<User, 'hashedPassword' | 'hashedRt' | 'salt'> | null>;
  update(userId: string, args: IUpdateUserDbQueryBuilderArgs): any;
}
