import { Prisma } from '@prisma/client';

export interface IAccountIntegrationDbQueryBuilder {
  // Account CRM management
  buildAddAccountCrmQuery(
    data: Pick<Prisma.AccountCrmUncheckedCreateInput, 'accountId' | 'crmId'>,
  ): Prisma.AccountCrmCreateArgs;
  buildUpdateAccountCrmQuery(
    accountCrmId: string,
    accountId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured'
    >,
  ): Prisma.AccountCrmUpdateArgs;
  buildRetrieveAccountCrmsQuery(
    accountId: string,
  ): Prisma.AccountCrmFindManyArgs;
  buildRetrieveAccountCrmQuery(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Prisma.AccountCrmFindUniqueArgs;

  // GENERALIZED
  // This should be generalizable with a union return
  buildRetrieveAllAccountIntegrationSecretReferencesQuery(
    accountCrmId: string,
  ): {
    where: { accountCrmId: string };
  };
  buildDeleteAccountIntegrationQuery(accountCrmId: string): {
    where: { id: string };
  };
}
