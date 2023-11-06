import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';
import { IAccountAndCatererDbHandler, IBuildCreateAccountQueryArgs } from '.';
import { AccountCrm, Prisma } from '@prisma/client';

@Injectable()
export class AccountAndCatererDbHandlerService
  implements IAccountAndCatererDbHandler
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountAndCatererDbQueryBuilderService,
  ) {}
  // Account Management
  async createAccount(args: IBuildCreateAccountQueryArgs) {
    const query = this.queryBuilder.buildCreateAccountQuery(args);
    return this.dbClient.account.create(query);
  }

  async retrieveAccount(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async updateAccount(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async assignAccountToOwner(accountId: string, ownerId: string) {
    const query = this.queryBuilder.buildCreateAccountUserQuery(
      accountId,
      ownerId,
    );
    return this.dbClient.accountOwner.create(query);
  }

  async unassignAccountToOwner(accountId: string, ownerId: string) {}

  async retrieveAccountAndOwnerPair(
    accountId: string,
    ownerId: string,
    include?: Prisma.AccountOwnerInclude,
  ) {
    const query = this.queryBuilder.buildRetrieveAccountAndOwnerPair(
      accountId,
      ownerId,
      include,
    );
    return this.dbClient.accountOwner.findUnique(query);
  }

  // Account Event Process management
  async addAccountEventProcess(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async retrieveAccountEventProcesses(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // Account Crm management
  async addAccountCrm(args: any): Promise<any> {
    // The Add Account CRM process enables the requester to create the AccountCrm record
    // This should NOT handle business logic of whether or not any credentials are included - that should be at the service level - whatever calls this
  }
  async retrieveAccountCrms(accountId: string): Promise<AccountCrm[]> {
    const query = this.queryBuilder.buildRetrieveAccountCrmsQuery(accountId);
    return this.dbClient.accountCrm.findMany(query);
  }
  async retrieveAccountCrmById(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Promise<AccountCrm | null> {
    const query = this.queryBuilder.buildRetrieveAccountCrmQuery(
      accountCrmId,
      include,
    );
    return this.dbClient.accountCrm.findUnique(query);
  }

  async updateAccountCrm(
    accountCrmId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured'
    >,
  ): Promise<any> {
    // The primary thing I'm thinking this will be for is to add the non-sensitive credentials AFTER CRM addition
    const query = this.queryBuilder.buildUpdateAccountCrmQuery(
      accountCrmId,
      updates,
    );
    return this.dbClient.accountCrm.update(query);
  }

  // Caterer Management
  async createCaterer(args: any): Promise<any> {}

  async retrieveCaterer(args: any): Promise<any> {}

  async addCatererPointOfContact(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
