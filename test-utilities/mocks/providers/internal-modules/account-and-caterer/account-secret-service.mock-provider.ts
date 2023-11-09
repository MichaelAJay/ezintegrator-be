import { IAccountSecretProvider } from 'src/internal-modules/account-and-caterer/interfaces';

export const mockAccountSecretService: IAccountSecretProvider = {
  addCrmSecret: jest.fn(),
};
