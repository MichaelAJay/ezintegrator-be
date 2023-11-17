import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ICrmIntegrationDbQueryBuilderProvider } from './interfaces';

@Injectable()
export class CrmIntegrationDbQueryBuilderService
  implements ICrmIntegrationDbQueryBuilderProvider
{
  buildGetCrmIntegration(crmId: string): Prisma.CrmFindUniqueArgs {
    return { where: { id: crmId } };
  }

  buildGetCrmIntegrations(include?: Prisma.CrmInclude): Prisma.CrmFindManyArgs {
    const query: Prisma.CrmFindManyArgs = {
      include: {
        validEventProcesses: true,
      },
    };
    if (include) {
      query.include = include;
    }
    return query;
  }
}
