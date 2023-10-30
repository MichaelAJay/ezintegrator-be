import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { JwtHandlerService } from '../security-utility/jwt-handler.service';
import { IAuthService, ILoginArgs } from './interfaces';

@Injectable()
export class AuthService implements IAuthService {
  // MAY NOT inject UserService (internal service provider)
  // MAY NOT inject AccountAndCatererService (internal service provider)
  constructor(
    private readonly userDbHandler: UserDbHandlerService,
    private readonly cryptoHandler: CryptoUtilityService,
    private readonly jwtHandler: JwtHandlerService,
  ) {}
  async authenticate(args: ILoginArgs): Promise<IGetAuthAndRefreshTokens> {
    const user = await this.userDbHandler.retrieveByEmail(args.email);
    // Throw unauthorized if user not found by email
    if (!user) {
      throw new UnauthorizedException();
    }

    // Throw unauthorized if password mismatch
    if (
      !(await this.cryptoHandler.validateSaltedHash(
        args.password,
        user.hashedPassword,
        user.salt,
      ))
    ) {
      throw new UnauthorizedException();
    }

    return this.login(user);
  }

  async refresh(token: string): Promise<IGetAuthAndRefreshTokens> {
    const { sub: userId } = await this.jwtHandler.verifyWithSecret(token);

    const user = await this.userDbHandler.retrieveById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      !(
        user.hashedRt &&
        this.cryptoHandler.validateSaltedHash(token, user.hashedRt, user.salt)
      )
    ) {
      throw new UnauthorizedException();
    }

    return this.login(user);
  }

  // Signs auth and refresh tokens, hashes refresh token, & saves refresh token on user record
  async login(user: { id: string; salt: string }) {
    const tokens = await this.jwtHandler.signAuthAndRefreshTokens({
      sub: user.id,
    });

    const hashedRt = await this.cryptoHandler.hash(tokens.rt, user.salt);
    await this.userDbHandler.update(user.id, { hashedRt });
    return tokens;
  }

  async logout(userId: string): Promise<{ success: boolean }> {
    throw new Error('Method not implemented.');
  }
}
