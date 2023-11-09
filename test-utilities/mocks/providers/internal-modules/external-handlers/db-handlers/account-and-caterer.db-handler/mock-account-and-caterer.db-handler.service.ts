import { IAccountAndCatererDbHandler } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler';

export const mockAccountAndCatererDbHandlerService: IAccountAndCatererDbHandler =
  {
    createAccount: jest.fn(),
    retrieveAccount: jest.fn(),
    updateAccount: jest.fn(),
    assignAccountToOwner: jest.fn(),
    unassignAccountToOwner: jest.fn(),
    addAccountEventProcess: jest.fn(),
    retrieveAccountEventProcesses: jest.fn(),
    createCaterer: jest.fn(),
    retrieveCaterer: jest.fn(),
    addCatererPointOfContact: jest.fn(),
    deleteAccount: jest.fn(),
    addUserAccountRole: jest.fn(),
  };
