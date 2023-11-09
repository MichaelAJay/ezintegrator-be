import { IAccountIntegrationClass } from '../../../../../../src/internal-modules/account-and-caterer/integration-classes/account-integration.class-interface';

export const mockAccountCrmIntegrator: IAccountIntegrationClass = {
  create: jest.fn(),
  retrieveOne: jest.fn(),
  update: jest.fn(),
};
