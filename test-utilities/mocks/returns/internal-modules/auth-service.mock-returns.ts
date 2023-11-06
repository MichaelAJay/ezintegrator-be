import { IGetAuthAndRefreshTokens } from '../../../../src/internal-modules/security-utility';

export function mockReturnLogin(): {
  userId: string;
  tokens: IGetAuthAndRefreshTokens;
} {
  const ret = {
    userId: 'MOCK_USER_ID',
    tokens: {
      at: 'MOCK_AT',
      rt: 'MOCK_RT',
    },
  };
  return ret;
}
