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

  // Always excludes hashedPassword, hashedRt, and salt - these would never be needed if id is already available
  buildFindUniqueByIdQuery<T extends Prisma.UserInclude | null>(
    id: string,
    include?: T,
  ): Prisma.UserFindUniqueArgs {
    const query: Prisma.UserFindUniqueArgs = {
      where: { id },
    };
    if (include) {
      query.include = include;
    }
    return query;
  }

  buildFindUniqueByEmailQuery(email: string): Prisma.UserFindUniqueArgs {
    return { where: { email } };
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

  // PERMISSIONS
  buildRetrieveUserPermissionsQuery(userId: string): Prisma.UserFindUniqueArgs {
    return {
      where: { id: userId },
      include: {
        accountRole: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    };
  }
}
