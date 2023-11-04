import { Injectable } from '@nestjs/common';
import { AccountOwnerWithUser } from '../external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-owner-with-user.schema-and-validator';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';
import { IAccountPermissionProvider } from './interfaces';

@Injectable()
export class AccountPermissionService implements IAccountPermissionProvider {
  constructor(private readonly userDbHandler: UserDbHandlerService) {}

  canUserEditSecretsForAccount(
    accountOwner: AccountOwnerWithUser,
    accountId: string,
  ): boolean {
    // Current implementation is that only the owner can edit secrets for an account
    // This method allows flexibility to change that permission when system permissions are added
    return accountOwner.owner.accountId === accountId;
  }
}
