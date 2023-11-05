import { Prisma } from '@prisma/client';

export interface IAccountSecretDbQueryBuilder {
  buildCreateAccountSecretReference(
    args: Prisma.AccountCrmSecretReferenceUncheckedCreateInput,
  ): Prisma.AccountCrmSecretReferenceCreateArgs;
}
