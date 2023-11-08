import { ConflictException, Injectable } from '@nestjs/common';
import { IBuildCreateAccountQueryArgs } from '../external-handlers/db-handlers/account-and-caterer.db-handler';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { IGetAuthAndRefreshTokens } from '../security-utility';
import { ICreateUserArgs } from '../user/interfaces';
import { UserService } from '../user/user.service';
import {
  IAccountAndCatererService,
  ICreateAccountAndUserArgs,
} from './interfaces';
import * as Sentry from '@sentry/node';
import { RoleAndPermissionDbHandlerService } from '../external-handlers/db-handlers/role-and-permission.db-handler/role-and-permission.db-handler.service';

@Injectable()
export class AccountAndCatererService implements IAccountAndCatererService {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
    private readonly userService: UserService,
    private readonly roleAndPermissionDbHandler: RoleAndPermissionDbHandlerService,
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

    const { userId, tokens } = await this.userService
      .create(createUserArgs)
      .catch(async (reason) => {
        if (reason instanceof ConflictException) {
          // Delete account and raise ConflictException
          await this.accountAndCatererDbHandler.deleteAccount(account.id);
        }
        reason.message = 'Account creation failed - email may not be used';
        throw reason;
      });

    try {
      const createAccountOwnershipPromise =
        this.accountAndCatererDbHandler.assignAccountToOwner(
          account.id,
          userId,
        );
      const createUserAccountRolePromise =
        this.accountAndCatererDbHandler.addUserAccountRole(
          userId,
          'MANAGER',
          userId,
        );
      await Promise.all([
        createAccountOwnershipPromise,
        createUserAccountRolePromise,
      ]);
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setExtras({
          accountName: args.accountName,
          ownerEmail: args.email,
        });
        Sentry.captureException(err);
      });
      throw err;
    }

    return tokens;
  }

  // User management
  async addUser(
    email: string,
    userId: string,
    accountId: string,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
