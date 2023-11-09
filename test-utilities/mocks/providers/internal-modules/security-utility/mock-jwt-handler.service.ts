import { IJwtHandler } from '../../../../../src/internal-modules/security-utility';
export const mockJwtHander: IJwtHandler = {
  signAuthAndRefreshTokens: jest.fn(),
  signAuthToken: jest.fn(),
  signRefreshToken: jest.fn(),
  signWithSecret: jest.fn(),
  verifyWithSecret: jest.fn(),
  verifyExpiration: jest.fn(),
};
