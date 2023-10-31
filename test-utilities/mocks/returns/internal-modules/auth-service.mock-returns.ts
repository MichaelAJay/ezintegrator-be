import { IGetAuthAndRefreshTokens } from '../../../../src/internal-modules/security-utility';

export function mockLoginReturn(): IGetAuthAndRefreshTokens {
  const ret: IGetAuthAndRefreshTokens = {
    at: 'MOCK_AT',
    rt: 'MOCK_RT',
  };
  return ret;
}
