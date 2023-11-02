import { IAuthTokenClaims } from '../../../../../src/internal-modules/security-utility';

export function mockReturnJwtHandlerVerifyWithSecret(): IAuthTokenClaims {
  const ret: IAuthTokenClaims = {
    iss: 'SELF',
    sub: 'MOCK_USER_ID',
    exp: 10000000000000,
  };
  return ret;
}
