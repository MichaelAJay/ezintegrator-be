import { IAuthTokenClaims } from '../../../../../src/internal-modules/security-utility';

export function mockReturnJwtHandlerVerifyWithSecret(
  isExpired = false,
): IAuthTokenClaims {
  const ret: IAuthTokenClaims = {
    iss: 'SELF',
    sub: 'MOCK_USER_ID',
    exp: Math.floor((Date.now() + (isExpired ? -3_600_000 : 3_600_000)) / 1000),
  };
  return ret;
}
