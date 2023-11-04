import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import * as Sentry from '@sentry/node';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';
import { retrieveSafeUserByIdWithAccountOwnerValidator } from '../external-handlers/db-handlers/user.db-handler/validators/retrieve-by-id.schemas-and-validators';
import { AccountPermissionService } from '../security-utility/account-permission.service';
import {
  AccountSecretReferenceSecretTypeValues,
  AccountSecretReferenceTargetTypeValues,
} from 'src/external-modules';
import { validateRetrievedAccountOwnerWithUser } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-owner-with-user.schema-and-validator';

@Injectable()
export class AccountAndCatererService implements IAccountAndCatererService {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
    private readonly userService: UserService,
    private readonly secretManagerService: SecretManagerService,
    private readonly userDbHandler: UserDbHandlerService,
    private readonly accountPermissionService: AccountPermissionService,
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

    try {
      await this.accountAndCatererDbHandler.assignAccountToOwner(
        account.id,
        userId,
      );
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

  async upsertSecret(
    userId: string,
    accountId: string,
    referenceType: AccountSecretReferenceTargetTypeValues,
    secretType: AccountSecretReferenceSecretTypeValues,
    secretPayload: string | Buffer,
  ) {
    const accountOwnerWithOwner =
      await this.accountAndCatererDbHandler.retrieveAccountAndOwnerPair(
        accountId,
        userId,
        { owner: true },
      );
    if (!accountOwnerWithOwner) {
      throw new NotFoundException(
        'Record not found. This may occur when the requesting user is not permissioned to carry out the requested action.',
      );
    }

    if (!validateRetrievedAccountOwnerWithUser(accountOwnerWithOwner)) {
      console.error(validateRetrievedAccountOwnerWithUser.errors);
      const err = new UnprocessableEntityException('Data failed validation');
      Sentry.withScope((scope) => {
        scope.setExtras({
          failedValidator: 'validateRetrievedAccountOwnerWithUser',
          data: JSON.stringify(accountOwnerWithOwner),
        });
        Sentry.captureException(err);
      });
      throw err;
    }

    const user = accountOwnerWithOwner.owner;

    if (
      !this.accountPermissionService.canUserEditSecretsForAccount(
        accountOwnerWithOwner,
        accountId,
      )
    ) {
      const err = new UnauthorizedException(
        'User may not edit secrets for the account',
      );
      Sentry.withScope((scope) => {
        scope.setExtras({ accountId, userId });
        Sentry.captureException(err);
      });
      throw err;
    }
    return user;
    // Working as intended to here

    // const secretReference =
    //   await this.accountAndCatererDbHandler.upsertAccountSecretReference(
    //     accountId,
    //     referenceType,
    //     secretType,
    //   );

    // await this.secretManagerService.upsertSecretVersion(
    //   secretReference.secretName,
    //   secretPayload,
    // );

    // return { success: true };
  }
}
