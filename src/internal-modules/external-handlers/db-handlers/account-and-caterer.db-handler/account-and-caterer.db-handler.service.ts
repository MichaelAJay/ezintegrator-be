import { Injectable } from '@nestjs/common';
import { DbClientService } from '../../../../external-modules';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';
import { IAccountAndCatererDbHandler, IBuildCreateAccountQueryArgs } from '.';

@Injectable()
export class AccountAndCatererDbHandlerService
  implements IAccountAndCatererDbHandler
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountAndCatererDbQueryBuilderService,
  ) {}
  // Account Management
  async createAccount(args: IBuildCreateAccountQueryArgs): Promise<any> {
    const query = this.queryBuilder.buildCreateAccountQuery(args);
    return this.dbClient.account.create(query);
  }

  async retrieveAccount(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async updateAccount(args: any): Promise<any> {
    throw new Error('Method not implemented.');
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

  async updateAccountCrmQuery(
    accountId: string,
    crmDetails: any,
  ): Promise<any> {
    // The primary thing I'm thinking this will be for is to add the non-sensitive credentials AFTER CRM addition
  }

  // Account Secret Reference management
  async upsertAccountSecretReference(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async retrieveAccountSecretReference(args: any): Promise<any> {}

  // Caterer Management
  async createCaterer(args: any): Promise<any> {}

  async retrieveCaterer(args: any): Promise<any> {}

  async addCatererPointOfContact(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
