import { Prisma } from '@prisma/client';
import { ICreateUserDbQueryBuilderArgs } from '../create-user.db-query-builder.args-interface';
import { IUpdateUserDbQueryBuilderArgs } from '../update-user.db-query-builder.args-interface';

export interface IUserDbQueryBuilder {
  buildCreateQuery(args: ICreateUserDbQueryBuilderArgs): Prisma.UserCreateArgs;
  buildFindUniqueByIdQuery(
    id: string,
    include?: Prisma.UserInclude,
  ): Prisma.UserFindUniqueArgs;
  buildFindUniqueByEmailQuery(email: string): Prisma.UserFindUniqueArgs;
  buildUpdateQuery(
    userId: string,
    args: IUpdateUserDbQueryBuilderArgs,
  ): Prisma.UserUpdateArgs;
}
