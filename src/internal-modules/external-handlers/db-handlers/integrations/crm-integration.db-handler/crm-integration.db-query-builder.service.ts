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
}
