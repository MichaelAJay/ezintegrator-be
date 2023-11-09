import { Injectable } from '@nestjs/common';
import { AccountCrmSecretReference, Prisma } from '@prisma/client';
import { DbClientService } from '../../../../external-modules';
import { AccountSecretDbQueryBuilderService } from './account-secret.db-query-builder.service';
import { IAccountSecretDbHandlerProvider } from './interfaces/class-interfaces/account-secret-db-handler.class-interface';

@Injectable()
export class AccountSecretDbHandlerService
  implements IAccountSecretDbHandlerProvider
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: AccountSecretDbQueryBuilderService,
  ) {}

  // Crm
  async createAccountCrmSecretReference(
    args: Prisma.AccountCrmSecretReferenceUncheckedCreateInput,
  ): Promise<AccountCrmSecretReference> {
    const query = this.queryBuilder.buildCreateAccountSecretReference(args);
    return this.dbClient.accountCrmSecretReference.create(query);
  }
}
