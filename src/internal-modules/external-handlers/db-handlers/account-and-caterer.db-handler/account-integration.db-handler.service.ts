import { Injectable } from '@nestjs/common';
import { AccountCrm, Prisma } from '@prisma/client';
import { DbClientService } from 'src/external-modules';
import { AccountIntegrationDbQueryBuilderService } from './account-integration.db-query-builder.service';
import { IAccountIntegrationDbHandlerProvider } from './interfaces';

@Injectable()
export class AccountIntegrationDbHandlerService
  implements IAccountIntegrationDbHandlerProvider
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountIntegrationDbQueryBuilderService,
  ) {}

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
}
