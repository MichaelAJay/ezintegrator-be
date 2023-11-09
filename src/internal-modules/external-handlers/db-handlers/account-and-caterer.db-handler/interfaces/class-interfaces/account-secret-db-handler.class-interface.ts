import { Prisma } from '@prisma/client';

export interface IAccountSecretDbHandlerProvider {
  createAccountCrmSecretReference(
    args: Prisma.AccountCrmSecretReferenceUncheckedCreateInput,
  ): Promise<any>;
}
