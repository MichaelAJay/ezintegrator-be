import { Injectable } from '@nestjs/common';
import { Crm, Prisma } from '@prisma/client';
import { DbClientService } from '../../../../../external-modules';
import { CrmIntegrationDbQueryBuilderService } from './crm-integration.db-query-builder.service';
import { ICrmIntegrationDbHandlerProvider } from './interfaces';

@Injectable()
export class CrmIntegrationDbHandlerService
  implements ICrmIntegrationDbHandlerProvider
{
  constructor(
    private readonly dbClient: DbClientService,
    private readonly queryBuilder: CrmIntegrationDbQueryBuilderService,
  ) {}

  async retrieveCrm(crmId: string): Promise<Crm> {
    const query = this.queryBuilder.buildGetCrmIntegration(crmId);
    return this.dbClient.crm.findUniqueOrThrow(query);
  }

  async retrieveCrms(include?: Prisma.CrmInclude): Promise<Crm[]> {
    const query = this.queryBuilder.buildGetCrmIntegrations(include);
    return this.dbClient.crm.findMany(query);
  }
}
