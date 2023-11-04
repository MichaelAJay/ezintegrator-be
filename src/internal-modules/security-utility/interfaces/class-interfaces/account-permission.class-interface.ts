export interface IAccountPermissionProvider {
  canUserEditSecretsForAccount(
    accountId: string,
    userId: string,
  ): Promise<boolean>;
}
