import { IUserService } from '../../../../../src/internal-modules/user/interfaces';

export const mockUserService: IUserService = {
  create: jest.fn(),
};
