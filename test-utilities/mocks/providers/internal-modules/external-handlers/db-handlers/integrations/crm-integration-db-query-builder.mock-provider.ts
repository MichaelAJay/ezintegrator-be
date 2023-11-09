import { ICrmIntegrationDbQueryBuilderProvider } from 'src/internal-modules/external-handlers/db-handlers/integrations/crm-integration.db-handler/interfaces';

export const mockCrmIntegrationDbQueryBuilder: ICrmIntegrationDbQueryBuilderProvider =
  {
    buildGetCrmIntegration: jest.fn(),
  };
