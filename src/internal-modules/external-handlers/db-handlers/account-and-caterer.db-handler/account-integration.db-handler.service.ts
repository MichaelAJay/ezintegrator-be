import { ConflictException, Injectable } from '@nestjs/common';
import { AccountCrm, Prisma } from '@prisma/client';
import { DbClientService } from '../../../../external-modules';
import { AccountIntegrationDbQueryBuilderService } from './account-integration.db-query-builder.service';
import { IAccountIntegrationDbHandlerProvider } from './interfaces';
import * as Sentry from '@sentry/node';
import { AccountIntegrationType } from '../../../account-and-caterer/types';
import { handlePrismaError } from '../prisma-error-handler.callback';

@Injectable()
export class AccountIntegrationDbHandlerService
  implements IAccountIntegrationDbHandlerProvider
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountIntegrationDbQueryBuilderService,
  ) {}

  // Account Crm management
  async addAccountCrm(
    data: Pick<Prisma.AccountCrmUncheckedCreateInput, 'accountId' | 'crmId'>,
  ): Promise<any> {
    try {
      // The Add Account CRM process enables the requester to create the AccountCrm record
      // This should NOT handle business logic of whether or not any credentials are included - that should be at the service level - whatever calls this
      const query = this.queryBuilder.buildAddAccountCrmQuery(data);

      // @TODO - remember to think about what happens when an invalid id is sent
      const result = await this.dbClient.accountCrm.create(query);
      return result;
    } catch (err) {
      console.error(err);
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('This integration is already in place');
      }
      throw err;
    }
  }
  async retrieveAccountCrms(accountId: string): Promise<AccountCrm[]> {
    const query = this.queryBuilder.buildRetrieveAccountCrmsQuery(accountId);
    return this.dbClient.accountCrm.findMany(query);
  }
  // async retrieveAccountCrmById(
  //   accountCrmId: string,
  //   include?: Prisma.AccountCrmInclude,
  // ): Promise<AccountCrm | null> {
  //   const query = this.queryBuilder.buildRetrieveAccountCrmQuery(
  //     accountCrmId,
  //     include,
  //   );
  //   return this.dbClient.accountCrm.findUnique(query);
  // }

  /**
   * @important Whatever calls this method should ensure that the accountCrm belongs to the same account as the requesting user
   */
  async retrieveAccountCrmById(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Promise<any | null> {
    const query = this.queryBuilder.buildRetrieveAccountCrmQuery(
      accountCrmId,
      include,
    );

    return this.dbClient.accountCrm.findUnique(query);
  }

  async updateAccountCrm(
    accountCrmId: string,
    accountId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured' | 'isActive'
    >,
  ): Promise<any> {
    // The primary thing I'm thinking this will be for is to add the non-sensitive credentials AFTER CRM addition
    const query = this.queryBuilder.buildUpdateAccountCrmQuery(
      accountCrmId,
      accountId,
      updates,
    );
    await this.dbClient.accountCrm
      .update(query)
      .catch((reason) =>
        handlePrismaError(
          reason,
          this.retrieveAccountCrmById.bind(this),
          accountCrmId,
          accountId,
        ),
      );
  }

  // GENERALIZED METHODS

  // Whatever calls this should validate the response
  async retrieveAllTargetAccountIntegrationSecretReferences(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ) {
    switch (integrationType) {
      case 'CRM':
        const query =
          this.queryBuilder.buildRetrieveAllAccountIntegrationSecretReferencesQuery(
            integrationId,
          );
        return this.dbClient.accountCrmSecretReference.findMany(query);
      default:
        throw new Error('Integration type not found');
    }
  }

  async deleteAccountIntegration(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ) {
    switch (integrationType) {
      case 'CRM':
        const query =
          this.queryBuilder.buildDeleteAccountIntegrationQuery(integrationId);
        return this.dbClient.accountCrm.delete(query);
      default:
        throw new Error('Integration type not found');
    }
  }

  // IMPORTANT:  service methods calling this should not pass secret names to the request response
  async retrieveAccountIntegrationsAndSecretReferencesByType(
    accountId: string,
    type: AccountIntegrationType,
  ): Promise<Array<any>> {
    switch (type) {
      case 'CRM':
        const query =
          this.queryBuilder.buildRetrieveAccountCrmIntegrationsAndSecretReferencesQuery(
            accountId,
          );
        return this.dbClient.accountCrm.findMany(query);
      default:
        const err = new Error('Invalid account integration type');
        Sentry.withScope((scope) => {
          scope.setExtra('type', type);
          Sentry.captureException(err);
        });
        throw err;
    }
  }
}
