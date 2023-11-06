import { AccountCrm, Prisma } from '@prisma/client';

export interface IAccountIntegrationDbHandlerProvider {
  // Account CRM management
  addAccountCrm(args: any): Promise<any>;
  retrieveAccountCrms(accountId: string): Promise<AccountCrm[]>;
  retrieveAccountCrmById(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Promise<AccountCrm | null>;
  updateAccountCrm(
    accountId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured'
    >,
  ): Promise<any>;
}
