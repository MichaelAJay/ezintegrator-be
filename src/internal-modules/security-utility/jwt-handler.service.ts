import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getEnvironmentVariable } from 'src/utility';
import { IAuthTokenClaims, IJwtHandler } from '.';
import { validateAuthTokenPayload } from './schemas-and-validators/auth-token.schema-and-validator';

@Injectable()
export class JwtHandlerService implements IJwtHandler {
  constructor(private readonly jwtService: JwtService) {}

  async signAuthAndRefreshTokens(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
  ) {
    const authTokenPromise = this.signAuthToken(payload);
    const refreshTokenPromise = this.signRefreshToken(payload);
    const [at, rt] = await Promise.all([authTokenPromise, refreshTokenPromise]);
    return { at, rt };
  }

  async signAuthToken(payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>) {
    return this.signWithSecret(
      payload,
      '1h',
      getEnvironmentVariable('INTERNAL_SIGNING_SECRET'),
    );
  }

  async signRefreshToken(payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>) {
    return this.signWithSecret(
      payload,
      '7d',
      getEnvironmentVariable('INTERNAL_SIGNING_SECRET'),
    );
  }

  async signWithSecret(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
    expiresIn: string,
    secret: string,
  ) {
    return this.jwtService.signAsync(
      { ...payload, iss: 'SELF' },
      { secret, expiresIn },
    );
  }

  async verifyWithSecret(
    token: string,
    secret = getEnvironmentVariable('INTERNAL_SIGNING_SECRET'),
  ): Promise<IAuthTokenClaims> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret,
    });

    // Validate payload
    if (!validateAuthTokenPayload(payload)) {
      throw new Error('Error here');
    }

    this.verifyExpiration(payload.exp);
    return payload;
  }

  verifyExpiration(exp: number) {
    if (Date.now() / 1000 > exp) {
      throw new Error('Access token expired');
    }
    return true;
  }
}
