import { Prisma } from '@prisma/client';
import { RoleNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
import { IBuildCreateAccountQueryArgs } from '../method-interfaces';

export interface IAccountAndCatererDbQueryBuilder {
  // Account management
  buildCreateAccountQuery(
    args: IBuildCreateAccountQueryArgs,
  ): Prisma.AccountCreateArgs;
  buildRetrieveAccountQuery(accountId: string): any;
  buildUpdateAccountQuery(accountId: string, updates: Record<string, any>): any;
  buildDeleteAccountQuery(accountId: string): Prisma.AccountDeleteArgs;
  buildCreateAccountUserQuery(
    accountId: string,
    userId: string,
    include?: Prisma.AccountOwnerInclude,
  ): Prisma.AccountOwnerCreateArgs;
  buildRetrieveAccountAndOwnerPair(
    accountId: string,
    ownerId: string,
  ): Prisma.AccountOwnerFindUniqueArgs;
  buildAddUserAccountRole(
    userId: string,
    roleName: RoleNameValue,
    grantorId: string,
  ): Prisma.UserAccountRoleCreateArgs;
  // Account Event management
  buildAddEventProcessQuery(accountId: string, process: any): any;
  buildRetrieveAccountEventProcessesQuery(accountId: string): any;
  // Account Caterer management
  buildCreateCatererQuery(accountId: string, catererDetails: any): any;
  buildRetrieveCatererQuery(args: any): any;
  buildAddCatererPointOfContactQuery(args: any): any;
}
