import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getEnvironmentVariable } from '../../utility';
import { IAuthTokenClaims, IGetAuthAndRefreshTokens, IJwtHandler } from '.';
import { validateAuthTokenPayload } from './schemas-and-validators/auth-token.schema-and-validator';
import * as Sentry from '@sentry/node';

@Injectable()
export class JwtHandlerService implements IJwtHandler {
  constructor(private readonly jwtService: JwtService) {}

  async signAuthAndRefreshTokens(
    payload: Omit<IAuthTokenClaims, 'iss' | 'exp'>,
  ): Promise<IGetAuthAndRefreshTokens> {
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
    try {
      const signedToken = await this.jwtService.signAsync(
        { ...payload, iss: 'SELF' },
        { secret, expiresIn },
      );
      return signedToken;
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }

  async verifyWithSecret(
    token: string,
    secret = getEnvironmentVariable('INTERNAL_SIGNING_SECRET'),
  ): Promise<IAuthTokenClaims> {
    // Throws JsonWebTokenError: invalid signature if secret does not match signing secret
    const payload = await this.jwtService.verifyAsync(token, {
      secret,
    });

    // Validate payload
    if (!validateAuthTokenPayload(payload)) {
      throw new Error('Invalid token');
    }

    this.verifyExpiration(payload.exp);
    return payload;
  }

  verifyExpiration(expInSeconds: number) {
    if (Date.now() > expInSeconds * 1000) {
      throw new Error('Access token expired');
    }
    return true;
  }
}

/**
 * What does the class do?
 * It utilizes the @nestjs/jwt package (which utilizes jsonwebtoken) to:
 * 1) take JWT payload input and sign tokens
 * 2) verify signed tokens and return JWT payloads
 */
