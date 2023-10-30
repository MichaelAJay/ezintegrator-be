import { ICryptoUtility } from '../../../../../src/internal-modules/security-utility';
export const mockCryptoUtility: ICryptoUtility = {
  generateSalt: jest.fn(),
  hash: jest.fn(),
  validateSaltedHash: jest.fn(),
};
