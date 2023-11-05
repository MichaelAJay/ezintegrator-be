import { Prisma } from '@prisma/client';
import { IBuildCreateAccountQueryArgs } from '../method-interfaces';

export interface IAccountAndCatererDbQueryBuilder {
  // Account management
  buildCreateAccountQuery(
    args: IBuildCreateAccountQueryArgs,
  ): Prisma.AccountCreateArgs;
  buildRetrieveAccountQuery(accountId: string): any;
  buildUpdateAccountQuery(accountId: string, updates: Record<string, any>): any;
  buildCreateAccountUserQuery(
    accountId: string,
    userId: string,
    include?: Prisma.AccountOwnerInclude,
  ): Prisma.AccountOwnerCreateArgs;
  buildRetrieveAccountAndOwnerPair(
    accountId: string,
    ownerId: string,
  ): Prisma.AccountOwnerFindUniqueArgs;
  // Account Event management
  buildAddEventProcessQuery(accountId: string, process: any): any;
  buildRetrieveAccountEventProcessesQuery(accountId: string): any;
  // Account CRM management
  buildAddAccountCrmQuery(accountId: string, crmDetails: any): any;
  buildUpdateAccountCrmQuery(accountId: string, crmDetails: any): any;
  buildRetrieveAccountCrmsQuery(
    accountId: string,
  ): Prisma.AccountCrmFindManyArgs;
  buildRetrieveAccountCrmQuery(
    accountCrmId: string,
  ): Prisma.AccountCrmFindUniqueArgs;
  // Account Caterer management
  buildCreateCatererQuery(accountId: string, catererDetails: any): any;
  buildRetrieveCatererQuery(args: any): any;
  buildAddCatererPointOfContactQuery(args: any): any;
}
