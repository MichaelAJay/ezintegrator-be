import { IAuthService } from '../../../../../src/internal-modules/auth/interfaces';
export const mockAuthService: IAuthService = {
  authenticate: jest.fn(),
  refresh: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
};
