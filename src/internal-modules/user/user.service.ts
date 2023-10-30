import { Injectable } from '@nestjs/common';
import {
  ICreateUserDbQueryBuilderArgs,
  UserDbHandlerService,
} from '../external-handlers/db-handlers/user.db-handler';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { JwtHandlerService } from '../security-utility/jwt-handler.service';
import { ICreateUserArgs, IUserService } from './interfaces';

@Injectable()
export class UserService implements IUserService {
  // UserService MAY NOT injectAccountAndCatererService
  constructor(
    private readonly userDbHandler: UserDbHandlerService,
    private readonly jwtHandler: JwtHandlerService,
    private readonly cryptoUtility: CryptoUtilityService,
  ) {}
  async create(args: ICreateUserArgs): Promise<IGetAuthAndRefreshTokens> {
    const salt = this.cryptoUtility.generateSalt();
    const hashedPassword = await this.cryptoUtility.hash(args.password, salt);
    const dbHandlerArgs: ICreateUserDbQueryBuilderArgs = {
      email: args.email,
      firstName: args.firstName,
      hashedPassword,
      salt,
      accountId: args.accountId,
    };
    if (args.lastName) {
      dbHandlerArgs.lastName = args.lastName;
    }

    const user = await this.userDbHandler.create(dbHandlerArgs);
    const tokens = await this.jwtHandler.signAuthAndRefreshTokens({
      sub: user.id,
    });

    return tokens;
  }
}
