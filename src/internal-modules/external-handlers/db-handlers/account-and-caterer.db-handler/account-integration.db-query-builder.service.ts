import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IAccountIntegrationDbQueryBuilder } from './interfaces';

@Injectable()
export class AccountIntegrationDbQueryBuilderService
  implements IAccountIntegrationDbQueryBuilder
{
  // Account CRM management
  buildAddAccountCrmQuery(
    data: Pick<Prisma.AccountCrmUncheckedCreateInput, 'accountId' | 'crmId'>,
  ): Prisma.AccountCrmCreateArgs {
    return {
      data,
      include: {
        crm: {
          include: {
            validEventProcesses: true,
          },
        },
      },
    };
  }

  buildUpdateAccountCrmQuery(
    accountCrmId: string,
    accountId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured'
    >,
  ): Prisma.AccountCrmUpdateArgs {
    const query: Prisma.AccountCrmUpdateArgs = {
      where: { id: accountCrmId, accountId },
      data: updates,
    };
    return query;
  }

  buildRetrieveAccountCrmsQuery(
    accountId: string,
  ): Prisma.AccountCrmFindManyArgs {
    const query: Prisma.AccountCrmFindManyArgs = {
      where: { accountId },
    };
    return query;
  }

  buildRetrieveAccountCrmQuery(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Prisma.AccountCrmFindUniqueArgs {
    const query: Prisma.AccountCrmFindUniqueArgs = {
      where: { id: accountCrmId },
    };
    if (include) {
      query.include = include;
    }
    return query;
  }

  // This should be generalizable with a union return -
  buildRetrieveAllAccountIntegrationSecretReferencesQuery(
    accountCrmId: string,
  ) {
    return {
      where: { accountCrmId },
    };
  }

  buildDeleteAccountIntegrationQuery(accountCrmId: string): {
    where: { id: string };
  } {
    return {
      where: { id: accountCrmId },
    };
  }

  buildRetrieveAccountCrmIntegrationsAndSecretReferencesQuery(
    accountId: string,
  ): Prisma.AccountCrmFindManyArgs {
    return {
      where: { accountId },
      include: {
        crm: true,
        secretRefs: true,
      },
    };
  }
}
