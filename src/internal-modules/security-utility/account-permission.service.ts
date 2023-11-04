import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validateRetrievedAccountOwnerWithUser } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-owner-with-user.schema-and-validator';
import { IAccountPermissionProvider } from './interfaces';
import * as Sentry from '@sentry/node';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler';

@Injectable()
export class AccountPermissionService implements IAccountPermissionProvider {
  constructor(
    private readonly accountAndCatererDbHandler: AccountAndCatererDbHandlerService,
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
}
