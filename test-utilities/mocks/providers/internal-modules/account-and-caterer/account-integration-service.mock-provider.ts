import { IAccountIntegrationProvider } from 'src/internal-modules/account-and-caterer/interfaces';

export const mockAccountIntegrationService: IAccountIntegrationProvider = {
  getAccountIntegration: jest.fn(),
  isAccountCrmFullyConfigured: jest.fn(),
  createAccountIntegration: jest.fn(),
  getAccountIntegrations: jest.fn(),
};
