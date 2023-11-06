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

  // Caterer Management
  async createCaterer(args: any): Promise<any> {}

  async retrieveCaterer(args: any): Promise<any> {}

  async addCatererPointOfContact(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
