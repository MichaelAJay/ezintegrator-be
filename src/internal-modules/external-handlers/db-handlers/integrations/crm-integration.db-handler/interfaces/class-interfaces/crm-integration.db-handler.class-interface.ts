import { Crm, Prisma } from '@prisma/client';

export interface ICrmIntegrationDbHandlerProvider {
  retrieveCrm(crmId: string): Promise<Crm>;
  retrieveCrms(include?: Prisma.CrmInclude): Promise<Crm[]>;
}
