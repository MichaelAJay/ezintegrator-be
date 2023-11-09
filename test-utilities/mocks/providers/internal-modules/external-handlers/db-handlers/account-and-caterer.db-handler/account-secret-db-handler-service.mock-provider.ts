import { IAccountSecretDbHandlerProvider } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/interfaces/class-interfaces/account-secret-db-handler.class-interface';

export const mockAccountSecretDbHandlerService: IAccountSecretDbHandlerProvider =
  {
    createAccountCrmSecretReference: jest.fn(),
  };
