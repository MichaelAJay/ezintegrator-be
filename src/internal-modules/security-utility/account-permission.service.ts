import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validateRetrievedAccountOwnerWithUser } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-owner-with-user.schema-and-validator';
import { IAccountPermissionProvider } from './interfaces';
import * as Sentry from '@sentry/node';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { PermissionNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';
import { validateUserWithPermissions } from './schemas-and-validators/user-permissions.schema-and-validator';

@Injectable()
export class AccountPermissionService implements IAccountPermissionProvider {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
    private readonly userDbHandler: UserDbHandlerService,
  ) {}

  async canUserEditSecretsForAccount(
    accountId: string,
    userId: string,
  ): Promise<boolean> {
    // Current implementation is that only the owner can edit secrets for an account
    // This method allows flexibility to change that permission when system permissions are added
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

    return accountOwnerWithOwner.owner.accountId === accountId;
  }

  /**
   * !!! IMPORTANT !!!
   * This only checks to see if the user has permissions on THEIR account
   * Any action taken on an account specified resource (e.g. an account integration)
   * should confirm that the user's accountId matches the specified resource's accountId
   */
  async doesUserHavePermission(
    userId: string,
    permissionName: PermissionNameValue,
  ): Promise<boolean> {
    const userWithPermissions =
      await this.userDbHandler.retrieveUserPermissions(userId);
    if (!validateUserWithPermissions(userWithPermissions)) {
      return false;
    }

    return userWithPermissions.accountRole.role.permissions.some(
      (permission) => permission.permission === permissionName,
    );
  }
}
