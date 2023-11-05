import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { IAccountSecretDbQueryBuilder } from './interfaces/class-interfaces/account-secret-db-query-builder.class-interface';

@Injectable()
export class AccountSecretDbQueryBuilderService
  implements IAccountSecretDbQueryBuilder
{
  buildCreateAccountSecretReference(
    args: Prisma.AccountCrmSecretReferenceUncheckedCreateInput,
  ): Prisma.AccountCrmSecretReferenceCreateArgs<DefaultArgs> {
    const query: Prisma.AccountCrmSecretReferenceCreateArgs<DefaultArgs> = {
      data: args,
    };
    return query;
  }
}
