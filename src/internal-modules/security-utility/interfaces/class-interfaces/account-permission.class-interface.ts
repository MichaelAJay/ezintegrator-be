import { AccountOwnerWithUser } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/validators/retrieve-account-owner-with-user.schema-and-validator';

export interface IAccountPermissionProvider {
  canUserEditSecretsForAccount(
    accountOwner: AccountOwnerWithUser,
    accountId: string,
  ): boolean;
}
