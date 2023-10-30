import { IGetAuthAndRefreshTokens } from 'src/internal-modules/security-utility';
import { ILoginArgs } from '..';

export interface IAuthService {
  authenticate(args: ILoginArgs): Promise<IGetAuthAndRefreshTokens>;
  refresh(token: string): Promise<IGetAuthAndRefreshTokens>;
  // Signs auth and refresh tokens, hashes refresh token, & saves refresh token on user record
  login(user: { id: string; salt: string }): Promise<IGetAuthAndRefreshTokens>;
  logout(userId: string): Promise<{ success: boolean }>;
}
