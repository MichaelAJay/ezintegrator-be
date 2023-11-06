import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockReturnJwtHandlerVerifyWithSecret } from '../../../test-utilities/mocks/returns/internal-modules/security-utility/jwt-handler-service.returns';
import { IAuthTokenClaims } from '.';
import { JwtHandlerService } from './jwt-handler.service';

describe('JwtHandlerService', () => {
  let service: JwtHandlerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [JwtHandlerService, JwtService],
    }).compile();

    service = module.get<JwtHandlerService>(JwtHandlerService);
    jwtService = module.get<JwtService>(JwtService);

    process.env.INTERNAL_SIGNING_SECRET = 'INTERNAL_SIGNING_SECRET';
  });

  describe('signWithSecret tests', () => {
    it('returns a string if jwtService.signAsync resolves', async () => {
      const payload: Omit<IAuthTokenClaims, 'iss' | 'exp'> = {
        sub: 'MOCK_USER_ID',
        acct: 'MOCK_ACCT_ID',
      };
      const secret = 'MOCK_SECRET';
      const token = await service.signWithSecret(payload, '1h', secret);
      const parts = token.split('.');

      expect(parts.length).toBe(3);

      const decodedPayload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString(),
      );

      expect(decodedPayload.iss).toBe('SELF');
      expect(decodedPayload.sub).toBe(payload.sub);
      expect(typeof decodedPayload.exp).toBe('number');
      const expInMS = decodedPayload.exp * 1000;
      const now = Date.now();
      expect(expInMS).toBeGreaterThan(now);

      const oneHourFromNow = now + 3600 * 1000;
      const delta = 1000; // 1000 ms for delta calculation
      // Tests that the difference between the token's exp and the alloted time is under delta (1 s)
      expect(expInMS - oneHourFromNow).toBeLessThan(delta);
    });
    it('throws an error if "expiresIn" is invalid', async () => {
      const payload: Omit<IAuthTokenClaims, 'iss' | 'exp'> = {
        sub: 'MOCK_USER_ID',
        acct: 'MOCK_ACCT_ID',
      };
      const secret = 'MOCK_SECRET';
      const INVALID_EXPIRES_IN = '@@@';

      await expect(
        service.signWithSecret(payload, INVALID_EXPIRES_IN, secret),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          '"expiresIn" should be a number of seconds or string representing a timespan',
        ),
      });
    });
    it('throws an error if "secret" is invalid', async () => {
      const payload: Omit<IAuthTokenClaims, 'iss' | 'exp'> = {
        sub: 'MOCK_USER_ID',
        acct: 'MOCK_ACCT_ID',
      };
      const INVALID_SECRET = 100;

      await expect(
        service.signWithSecret(
          payload,
          '1h',
          // Required to force negative behavior
          INVALID_SECRET as unknown as string,
        ),
      ).rejects.toMatchObject({
        message: expect.stringContaining(
          'secretOrPrivateKey is not valid key material',
        ),
      });
    });
  });
  describe('verifyWithSecret tests', () => {
    it('returns payload if incoming token is valid and has not expired', async () => {
      const partialPayload = { sub: 'MOCK_USER_ID', acct: 'MOCK_ACCT_ID' };
      const validToken = await service.signAuthToken({
        sub: partialPayload.sub,
        acct: partialPayload.acct,
      });
      const result = await service.verifyWithSecret(validToken);

      expect(result.sub).toBe(partialPayload.sub);
      expect(result.iss).toBe('SELF');

      // Working out the math on the signAuthToken implementation's exp setting is not the point of this test
      expect(typeof result.exp).toBe('number');
    });
    it('throws error if secret passed in to verifyAsync does not match secret used to sign token', async () => {
      const partialPayload = { sub: 'MOCK_USER_ID', acct: 'MOCK_ACCT_ID' };
      const validToken = await service.signAuthToken(partialPayload);
      process.env.INTERNAL_SIGNING_SECRET = 'DIFFERENT_SECRET';
      await expect(service.verifyWithSecret(validToken)).rejects.toThrow(
        'invalid signature',
      );
    });
    it('throws "Invalid token" error if token payload fails validation', async () => {
      const partialPayload = {};
      // Most importantly, if sub claim is missing
      const INVALID_TOKEN = await service.signAuthToken(
        partialPayload as unknown as Omit<IAuthTokenClaims, 'iss' | 'exp'>,
      );

      await expect(service.verifyWithSecret(INVALID_TOKEN)).rejects.toThrow(
        'Invalid token',
      );
    });
  });

  afterEach(() => jest.clearAllMocks());
});
