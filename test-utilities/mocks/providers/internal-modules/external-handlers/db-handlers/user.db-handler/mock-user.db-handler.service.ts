import { IUserDbHandler } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/user.db-handler';

export const mockUserDbHandler: IUserDbHandler = {
  create: jest.fn(),
  retrieveById: jest.fn(),
  retrieveByEmail: jest.fn(),
  update: jest.fn(),
};
