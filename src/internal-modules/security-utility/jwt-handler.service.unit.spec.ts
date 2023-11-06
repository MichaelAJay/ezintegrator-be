import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtHandlerService } from './jwt-handler.service';
import * as Sentry from '@sentry/node';
import { mockJwtService } from '../../../test-utilities';
import { mockReturnJwtHandlerVerifyWithSecret } from '../../../test-utilities/mocks/returns/internal-modules/security-utility/jwt-handler-service.returns';
import * as PayloadValidator from './schemas-and-validators/auth-token.schema-and-validator';
import { IAuthTokenClaims } from '.';

jest.mock('./schemas-and-validators/auth-token.schema-and-validator');

describe('JwtHandlerService', () => {
  let service: JwtHandlerService;
  let jwtService: JwtService;

  const mockedValidateAuthTokenPayload =
    PayloadValidator.validateAuthTokenPayload as jest.MockedFunction<
      typeof PayloadValidator.validateAuthTokenPayload
    >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtHandlerService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<JwtHandlerService>(JwtHandlerService);
    jwtService = module.get<JwtService>(JwtService);

    process.env.INTERNAL_SIGNING_SECRET = 'INTERNAL_SIGNING_SECRET';
  });

  describe('signWithSecret tests', () => {
    it('calls Sentry.captureException when jwtService.signAsync throws and propagates error', async () => {
      const MOCK_ERROR = new Error('Error under test');
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => {
        throw MOCK_ERROR;
      });

      const spy = jest.spyOn(Sentry, 'captureException');

      // Error propagates
      await expect(
        service.signWithSecret({ sub: 'MOCK_USER_ID' }, '1h', 'MOCK_SECRET'),
      ).rejects.toThrow(MOCK_ERROR);

      // Sentry.captureException is called once with the thrown error
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(MOCK_ERROR);
    });
  });

  describe('signAuthAndRefreshTokens tests', () => {
    const mockPayload = { sub: 'MOCK_USER_ID', acct: 'MOCK_ACCT_ID' };
    const mockAt = 'MOCK_AT';
    const mockRt = 'MOCK_RT';
    it('calls service signAuthToken and signRefreshToken once each, with the correct args', async () => {
      const atSpy = jest
        .spyOn(service, 'signAuthToken')
        .mockResolvedValue(mockAt);
      const rtSpy = jest
        .spyOn(service, 'signRefreshToken')
        .mockResolvedValue(mockRt);

      await service.signAuthAndRefreshTokens(mockPayload);
      expect(atSpy).toHaveBeenCalledTimes(1);
      expect(rtSpy).toHaveBeenCalledTimes(1);

      expect(atSpy).toHaveBeenCalledWith(mockPayload);
      expect(rtSpy).toHaveBeenCalledWith(mockPayload);
    });
    it('returns an object with the promise resolutions of service signAuthToken and signRefreshToken', async () => {
      jest.spyOn(service, 'signAuthToken').mockResolvedValue(mockAt);
      jest.spyOn(service, 'signRefreshToken').mockResolvedValue(mockRt);

      const result = await service.signAuthAndRefreshTokens(mockPayload);
      expect(result).toEqual({ at: mockAt, rt: mockRt });
    });
    it('throws an error if either signAuthToken or signRefreshToken rejects', async () => {
      jest.spyOn(service, 'signAuthToken').mockResolvedValue(mockAt);
      const MOCK_ERROR = new Error('MOCK ERROR');
      jest.spyOn(service, 'signRefreshToken').mockRejectedValue(MOCK_ERROR);

      await expect(
        service.signAuthAndRefreshTokens(mockPayload),
      ).rejects.toThrow(MOCK_ERROR);
    });
  });

  describe('verifyWithSecret tests', () => {
    const MOCK_SECRET = 'MOCK_SECRET';
    const MOCK_TOKEN = 'NOT_JWT';
    it('calls jwtService.verifyAsync once with the correct args', async () => {
      const spy = jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));

      await expect(
        service.verifyWithSecret(MOCK_TOKEN, MOCK_SECRET),
      ).rejects.toThrow();

      // Primary tests
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(MOCK_TOKEN, { secret: MOCK_SECRET });
    });
    it('checks the token expiration if the resolved value from jwtService.verifyAsync passes validation', async () => {
      const payload = mockReturnJwtHandlerVerifyWithSecret();
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      // validateAuthTokenPayload(payload) returns true - validation passed
      mockedValidateAuthTokenPayload.mockImplementation(
        (data: unknown): data is IAuthTokenClaims => {
          return true;
        },
      );

      const spy = jest.spyOn(service, 'verifyExpiration');

      // Not primary tested behavior
      await service.verifyWithSecret(MOCK_TOKEN);

      // Primary tests
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(payload.exp);
    });
    it('throws "Invalid token" error if jwtService.verifyAsync resolves to an invalid payload', async () => {
      const INVALID_PAYLOAD = {};
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(INVALID_PAYLOAD);

      mockedValidateAuthTokenPayload.mockImplementation(
        (data: unknown): data is IAuthTokenClaims => {
          return false;
        },
      );

      await expect(service.verifyWithSecret(MOCK_TOKEN)).rejects.toThrow(
        'Invalid token',
      );
    });
    it('returns the resolved value from jwtService.verifyAsync if the verified payload is valid and has not expired', async () => {
      const payload = mockReturnJwtHandlerVerifyWithSecret();
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      mockedValidateAuthTokenPayload.mockImplementation(
        (data: unknown): data is IAuthTokenClaims => {
          return true;
        },
      );

      jest.spyOn(service, 'verifyExpiration').mockImplementation(() => true);
      const result = await service.verifyWithSecret(MOCK_TOKEN);

      expect(result).toEqual(payload);
    });
    it('throws "Access token expired" if valid token\'s "exp" property is expired"', async () => {
      const payload = mockReturnJwtHandlerVerifyWithSecret(true);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      mockedValidateAuthTokenPayload.mockImplementation(
        (data: unknown): data is IAuthTokenClaims => {
          return true;
        },
      );

      jest.spyOn(service, 'verifyExpiration').mockImplementation(() => {
        throw new Error('Access token expired');
      });
      await expect(service.verifyWithSecret(MOCK_TOKEN)).rejects.toThrow(
        'Access token expired',
      );
    });
    // Not sure how to test this one - may be integration test
    it('throws an error if the verifying secret is different from the signing secret', async () => {});
  });
  describe('verifyExpiration tests', () => {
    const ONE_HOUR_IN_SEC = 3_600_000;
    it('returns true if the exp is greater than or equal to now', () => {
      const exp = Math.floor(Date.now() / 1000 + ONE_HOUR_IN_SEC);
      expect(service.verifyExpiration(exp)).toBe(true);
    });
    it('throw "Access token expired" error if exp is less than now', () => {
      const exp = Math.floor(Date.now() / 1000 - ONE_HOUR_IN_SEC);
      expect(() => service.verifyExpiration(exp)).toThrow(
        'Access token expired',
      );
    });
  });

  afterEach(() => jest.restoreAllMocks());
});
