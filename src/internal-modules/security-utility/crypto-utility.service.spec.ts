import { Test, TestingModule } from '@nestjs/testing';
import { CryptoUtilityService } from './crypto-utility.service';

jest.mock('crypto', () => {
  const originalCrypto = jest.requireActual('crypto');
  return {
    ...originalCrypto,
    randomBytes: jest.fn(() =>
      Buffer.from('1234567890abcdef1234567890abcdef', 'hex'),
    ),
    pbkdf2: jest.fn((value, salt, iterations, keylen, digest, callback) => {
      process.nextTick(() =>
        callback(null, Buffer.from(`hashed-${value}-${salt}`)),
      );
    }),
  };
});

describe('CryptoUtilityService', () => {
  let service: CryptoUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoUtilityService],
    }).compile();

    service = module.get<CryptoUtilityService>(CryptoUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSaltAndHashValue unit tests', () => {
    it('should generate a valid salt and hash a provided value', async () => {
      const value = 'TEST_VALUE';
      const result = await service.generateSaltAndHashValue(value);

      expect(result).toHaveProperty('salt');
      expect(result.salt).toMatch(/^[a-f0-9]{32}$/);
      expect(result).toHaveProperty('hashedValue');
      expect(result.hashedValue).not.toBe(value);

      const directHashedValue = await service.hash(value, result.salt);
      expect(directHashedValue).toBe(result.hashedValue);
    });
  });
  describe('validateSaltedHash unit tests', () => {
    it('should return true for a value with the correct salt and hash', async () => {
      const value = 'testPassword';
      const { hashedValue, salt } = await service.generateSaltAndHashValue(
        value,
      );

      const isValid = await service.validateSaltedHash(
        value,
        hashedValue,
        salt,
      );
      expect(isValid).toBe(true);
    });
    it('should return false for a value with incorrect salt or hash', async () => {
      const value = 'testPassword';
      const { hashedValue, salt } = await service.generateSaltAndHashValue(
        value,
      );

      // Test with incorrect value
      expect(
        await service.validateSaltedHash('wrongValue', hashedValue, salt),
      ).toBe(false);
      // Test with incorrect salt
      expect(
        await service.validateSaltedHash(value, hashedValue, 'wrongSalt'),
      ).toBe(false);
    });
  });

  afterAll(() => jest.unmock('crypto'));
});
