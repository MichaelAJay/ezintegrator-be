import { Injectable } from '@nestjs/common';
import { SecretManagerService } from 'src/external-modules/secret-manager/secret-manager.service';
import { IBuildCreateAccountQueryArgs } from '../external-handlers/db-handlers/account-and-caterer.db-handler';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { ICreateUserArgs } from '../user/interfaces';
import { UserService } from '../user/user.service';
import {
  IAccountAndCatererService,
  ICreateAccountAndUserArgs,
} from './interfaces';

@Injectable()
export class AccountAndCatererService implements IAccountAndCatererService {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
    private readonly userService: UserService,
    private readonly secretManagerService: SecretManagerService,
  ) {}

  // Special note:  The accountOwner relation is CRUCIAL to get right.  If any part of this fails, I have to manually roll everything back, because
  // it can't be done in a transaction
  async createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens> {
    // Create account
    const createAccountArgs: IBuildCreateAccountQueryArgs = {
      name: args.accountName,
      ownerEmail: args.email,
      contactEmail: args.email,
    };
    const account = await this.accountAndCatererDbHandler.createAccount(
      createAccountArgs,
    );

    // Create user
    const createUserArgs: ICreateUserArgs = {
      email: args.email,
      firstName: args.firstName,
      accountId: account.id,
      password: args.password,
    };
    if (args.lastName) {
      createUserArgs.lastName = args.lastName;
    }
    // Await created user resolution - important for stack trace
    const { userId, tokens } = await this.userService.create(createUserArgs);

    return tokens;
  }

  async upsertSecret(
    userId: string,
    secretName: string,
    secretPayload: string | Buffer,
  ) {
    const secretId = 'UUID';

    await this.secretManagerService.upsertSecretVersion(
      secretId,
      secretPayload,
    );
  }
}
