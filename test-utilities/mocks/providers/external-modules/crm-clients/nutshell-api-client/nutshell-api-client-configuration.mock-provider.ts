import { INutshellApiClientConfigurationService } from '../../../../../../src/external-modules/crm-client';

export const mockNutshellApiClientConfigurationService: INutshellApiClientConfigurationService =
  {
    generateClient: jest.fn(),
    getApiForUsername: jest.fn(),
  };
