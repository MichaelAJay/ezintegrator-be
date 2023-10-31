import { ICryptoUtility } from '../../../../../src/internal-modules/security-utility';
export const mockCryptoUtility: ICryptoUtility = {
  generateSaltAndHashValue: jest.fn(),
  generateSalt: jest.fn(),
  hash: jest.fn(),
  validateSaltedHash: jest.fn(),
};
