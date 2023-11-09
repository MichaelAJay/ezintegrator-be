import { IAccountIntegrationDbQueryBuilder } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler';

export const mockAccountIntegrationDbQueryBuilder: IAccountIntegrationDbQueryBuilder =
  {
    buildAddAccountCrmQuery: jest.fn(),
    buildUpdateAccountCrmQuery: jest.fn(),
    buildRetrieveAccountCrmsQuery: jest.fn(),
    buildRetrieveAccountCrmQuery: jest.fn(),
  };
