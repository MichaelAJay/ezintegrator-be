import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { RoleNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
import {
  IAccountAndCatererDbQueryBuilder,
  IBuildCreateAccountQueryArgs,
} from '.';

@Injectable()
export class AccountAndCatererDbQueryBuilderService
  implements IAccountAndCatererDbQueryBuilder
{
  // Account management
  buildCreateAccountQuery(
    args: IBuildCreateAccountQueryArgs,
  ): Prisma.AccountCreateArgs<DefaultArgs> {
    const query: Prisma.AccountCreateArgs<DefaultArgs> = {
      data: args,
    };
    return query;
  }
  buildRetrieveAccountQuery(accountId: string) {
    throw new Error('Method not implemented.');
  }
  buildUpdateAccountQuery(accountId: string, updates: Record<string, any>) {
    throw new Error('Method not implemented.');
  }
  buildDeleteAccountQuery(accountId: string): Prisma.AccountDeleteArgs {
    return {
      where: { id: accountId },
    };
  }
  buildCreateAccountUserQuery(
    accountId: string,
    userId: string,
  ): Prisma.AccountOwnerCreateArgs {
    const query: Prisma.AccountOwnerCreateArgs = {
      data: { accountId, ownerId: userId },
    };
    return query;
  }
  buildRetrieveAccountAndOwnerPair(
    accountId: string,
    ownerId: string,
    include?: Prisma.AccountOwnerInclude,
  ): Prisma.AccountOwnerFindUniqueArgs {
    const query: Prisma.AccountOwnerFindUniqueArgs = {
      where: { accountId_ownerId: { accountId, ownerId } },
    };
    if (include) {
      query.include = include;
    }
    return query;
  }
  buildAddUserAccountRole(
    userId: string,
    roleName: RoleNameValue,
    grantorId: string,
  ): Prisma.UserAccountRoleCreateArgs {
    return {
      data: { userId, roleName, grantorId },
    };
  }

  // Account Event management
  buildAddEventProcessQuery(accountId: string, process: any) {
    throw new Error('Method not implemented.');
  }
  buildRetrieveAccountEventProcessesQuery(accountId: string) {
    throw new Error('Method not implemented.');
  }

  // Account Caterer management
  buildCreateCatererQuery(accountId: string, catererDetails: any) {
    throw new Error('Method not implemented.');
  }
  buildRetrieveCatererQuery(args: any) {
    throw new Error('Method not implemented.');
  }
  buildAddCatererPointOfContactQuery(args: any) {
    throw new Error('Method not implemented.');
  }
}
