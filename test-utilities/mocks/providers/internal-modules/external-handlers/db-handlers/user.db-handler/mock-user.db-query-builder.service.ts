import { IUserDbQueryBuilder } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/user.db-handler';

export const mockUserDbQueryBuilder: IUserDbQueryBuilder = {
  buildCreateQuery: jest.fn(),
  buildFindUniqueByIdQuery: jest.fn(),
  buildFindUniqueByEmailQuery: jest.fn(),
  buildUpdateQuery: jest.fn(),
};
