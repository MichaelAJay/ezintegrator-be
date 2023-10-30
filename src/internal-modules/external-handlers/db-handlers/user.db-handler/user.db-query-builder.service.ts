import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { IUserDbQueryBuilder } from '.';
import { ICreateUserDbQueryBuilderArgs } from './interfaces';

@Injectable()
export class UserDbQueryBuilderService implements IUserDbQueryBuilder {
  buildCreateQuery(
    args: ICreateUserDbQueryBuilderArgs,
  ): Prisma.UserCreateArgs<DefaultArgs> {
    return { data: args };
  }

  buildUpdateQuery(
    userId: string,
    args: Partial<
      Pick<
        Prisma.UserUncheckedUpdateInput,
        | 'email'
        | 'firstName'
        | 'lastName'
        | 'hashedPassword'
        | 'hashedRt'
        | 'salt'
      >
    >,
  ): Prisma.UserUpdateArgs<DefaultArgs> {
    return { where: { id: userId }, data: args };
  }
}
