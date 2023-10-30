import { INutshellApiClientConfigurationService } from '../../../../../../src/external-modules/crm-clients';

export const mockNutshellApiClientConfigurationService: INutshellApiClientConfigurationService =
  {
    generateClient: jest.fn(),
    getApiForUsername: jest.fn(),
  };
