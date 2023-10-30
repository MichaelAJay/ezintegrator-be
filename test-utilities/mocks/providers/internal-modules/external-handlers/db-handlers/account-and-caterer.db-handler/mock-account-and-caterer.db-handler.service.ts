import { IAccountAndCatererDbHandler } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler';

export const mockAccountAndCatererDbHandlerService: IAccountAndCatererDbHandler =
  {
    createAccount: jest.fn(),
    retrieveAccount: jest.fn(),
    updateAccount: jest.fn(),
    addAccountEventProcess: jest.fn(),
    retrieveAccountEventProcesses: jest.fn(),
    addAccountCrm: jest.fn(),
    upsertAccountSecretReference: jest.fn(),
    retrieveAccountSecretReference: jest.fn(),
    createCaterer: jest.fn(),
    retrieveCaterer: jest.fn(),
    addCatererPointOfContact: jest.fn(),
  };
