import { IAccountIntegrationDbHandlerProvider } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler';

export const mockAccountIntegrationDbHandlerService: IAccountIntegrationDbHandlerProvider =
  {
    addAccountCrm: jest.fn(),
    retrieveAccountCrms: jest.fn(),
    retrieveAccountCrmById: jest.fn(),
    updateAccountCrm: jest.fn(),
  };
