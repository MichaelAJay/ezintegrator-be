import { IAccountAndCatererDbQueryBuilder } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler';
export const mockAccountAndCatererDbQueryBuilder: IAccountAndCatererDbQueryBuilder =
  {
    buildCreateAccountQuery: jest.fn(),
    buildRetrieveAccountQuery: jest.fn(),
    buildUpdateAccountQuery: jest.fn(),
    buildCreateAccountUserQuery: jest.fn(),
    buildRetrieveAccountAndOwnerPair: jest.fn(),
    buildAddEventProcessQuery: jest.fn(),
    buildRetrieveAccountEventProcessesQuery: jest.fn(),
    buildCreateCatererQuery: jest.fn(),
    buildRetrieveCatererQuery: jest.fn(),
    buildAddCatererPointOfContactQuery: jest.fn(),
  };
