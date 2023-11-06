import { Prisma } from '@prisma/client';

export interface IAccountIntegrationDbQueryBuilder {
  // Account CRM management
  buildAddAccountCrmQuery(accountId: string, crmDetails: any): any;
  buildUpdateAccountCrmQuery(
    accountCrmId: string,
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
}
