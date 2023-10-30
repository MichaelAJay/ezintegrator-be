import { IGetAuthAndRefreshTokens } from '..';
import { IAuthTokenClaims } from '../auth-token-claims.interface';

export interface IJwtHandler {
  signAuthAndRefreshTokens(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
  ): Promise<IGetAuthAndRefreshTokens>;
  signAuthToken(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
  ): Promise<string>;
  signRefreshToken(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
  ): Promise<string>;
  signWithSecret(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
    expiresIn: string,
    secret: string,
  ): Promise<any>;
  verifyWithSecret(token: string, secret?: string): Promise<any>;
  verifyExpiration(exp: number): any;
}
