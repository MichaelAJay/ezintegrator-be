import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ICreateUserDbQueryBuilderArgs } from '../external-handlers/db-handlers/user.db-handler';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { ICreateUserArgs, IUserService } from './interfaces';

@Injectable()
export class UserService implements IUserService {
  // UserService MAY NOT injectAccountAndCatererService
  constructor(
    private readonly userDbHandler: UserDbHandlerService,
    private readonly cryptoUtility: CryptoUtilityService,
    private readonly authService: AuthService,
  ) {}
  async create(
    args: ICreateUserArgs,
  ): Promise<{ userId: string; tokens: IGetAuthAndRefreshTokens }> {
    // Enforce unique email constraint
    const existingUser = await this.userDbHandler.retrieveByEmail(args.email);
    if (existingUser) {
      const errMsg =
        existingUser.accountId === args.accountId
          ? 'This email is already associated with this account'
          : 'This email may not be used to create a user account';
      throw new ConflictException(errMsg);
    }

    // Create system-defined user attributes
    const { hashedValue: hashedPassword, salt } =
      await this.cryptoUtility.generateSaltAndHashValue(args.password);

    // Create user
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

    // Await resolution - important for stack trace
    const tokens = await this.authService.login({
      id: user.id,
      salt: user.salt,
    });
    return { userId: user.id, tokens };
  }
}
