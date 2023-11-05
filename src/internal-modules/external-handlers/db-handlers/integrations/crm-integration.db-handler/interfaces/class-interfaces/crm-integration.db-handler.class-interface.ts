import { Crm } from '@prisma/client';

export interface ICrmIntegrationDbHandlerProvider {
  retrieveCrm(crmId: string): Promise<Crm>;
}
