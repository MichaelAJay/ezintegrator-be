import { Prisma } from '@prisma/client';

export interface ICrmIntegrationDbQueryBuilderProvider {
  buildGetCrmIntegration(crmId: string): Prisma.CrmFindUniqueArgs;
  buildGetCrmIntegrations(include?: Prisma.CrmInclude): Prisma.CrmFindManyArgs;
}
