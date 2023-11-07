import { ICrmIntegrationDbHandlerProvider } from 'src/internal-modules/external-handlers/db-handlers/integrations/crm-integration.db-handler/interfaces';

export const mockCrmIntegrationDbHandlerService: ICrmIntegrationDbHandlerProvider =
  {
    retrieveCrm: jest.fn(),
    retrieveCrms: jest.fn(),
  };
