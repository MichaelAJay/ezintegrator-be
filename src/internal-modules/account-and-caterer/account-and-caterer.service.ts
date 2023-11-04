import {
  Injectable,
  NotFoundException,
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
import { AccountPermissionService } from '../security-utility/account-permission.service';
import {
  AccountSecretReferenceSecretTypeValues,
  AccountSecretReferenceTargetTypeValues,
} from 'src/external-modules';

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
    if (
      !(await this.accountPermissionService.canUserEditSecretsForAccount(
        accountId,
        userId,
      ))
    ) {
      throw new NotFoundException(
        'Permission not found.  This may occur if the requesting user does not have permission to fulfill the given request.',
      );
    }

    const referenceId = '';

    const secretReference =
      await this.accountAndCatererDbHandler.upsertAccountSecretReference(
        accountId,
        referenceType,
        referenceId,
        secretType,
      );
    await this.secretManagerService.upsertSecretVersion(
      secretReference.secretName,
      secretPayload,
    );
    return { success: true };
  }

  // This may need to handle 1:M too in the future
  async getReferenceIdForAccountReferenceType(
    accountId: string,
    referenceType: AccountSecretReferenceTargetTypeValues,
  ) {
    /**
     * User story:
     * A user wants to add a secret of referenceType "Crm" to their record
     * This operation should complete successfully if the associated account has a record of type "referenceType"
     * This oepration should fail otherwise
     */
    let referenceId = '';
    switch (referenceType) {
      case 'CRM':
        const accountCrm =
          await this.accountAndCatererDbHandler.retrieveAccountCrm(accountId);
        if (!accountCrm) {
          throw new UnprocessableEntityException(
            "The provided account hasn't configured a CRM yet.",
          );
        }
        referenceId = accountCrm.crmId;
        break;
      default:
        throw new UnprocessableEntityException(
          `The user\'s associated account does not have the ${referenceType} configured yet.  Please do that first.`,
        );
    }
    return referenceId;
  }
}
