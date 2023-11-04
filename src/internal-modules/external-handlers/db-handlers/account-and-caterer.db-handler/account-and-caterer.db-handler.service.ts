import { Injectable } from '@nestjs/common';
import {
  AccountSecretReferenceSecretTypeValues,
  AccountSecretReferenceTargetTypeValues,
  DbClientService,
} from '../../../../external-modules';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';
import { IAccountAndCatererDbHandler, IBuildCreateAccountQueryArgs } from '.';
import { AccountSecretReference, Prisma } from '@prisma/client';

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
  async retrieveAccountCrm(accountId: string): Promise<{
    accountId: string;
    crmId: string;
    nonSensitiveCredentials: Prisma.JsonValue;
    isConfigured: boolean;
  } | null> {
    const query = this.queryBuilder.buildRetrieveAccountCrmQuery(accountId);
    return this.dbClient.accountCrm.findUnique(query);
  }

  async updateAccountCrmQuery(
    accountId: string,
    crmDetails: any,
  ): Promise<any> {
    // The primary thing I'm thinking this will be for is to add the non-sensitive credentials AFTER CRM addition
  }

  // Account Secret Reference management

  // referenceId MUST enforce referential constraint at the APPLICATION-level
  // Exp:  If referenceType is "CRM", then referenceId must be a valid id from the "Crm" table
  async upsertAccountSecretReference(
    accountId: string,
    referenceType: AccountSecretReferenceTargetTypeValues,
    referenceId: string,
    secretType: AccountSecretReferenceSecretTypeValues,
  ): Promise<AccountSecretReference> {
    const query = this.queryBuilder.buildUpsertAccountSecretReferenceQuery(
      accountId,
      referenceType,
      referenceId,
      secretType,
    );
    const result = await this.dbClient.accountSecretReference.create(query);
    return result;
  }

  async retrieveAccountSecretReference(args: any): Promise<any> {}

  // Caterer Management
  async createCaterer(args: any): Promise<any> {}

  async retrieveCaterer(args: any): Promise<any> {}

  async addCatererPointOfContact(args: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
