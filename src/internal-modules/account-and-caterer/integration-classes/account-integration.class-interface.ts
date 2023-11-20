// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(integrationId: string, accountId: string): Promise<any>;
  retrieveOne(
    accountIntegrationId: string,
    requester: { accountId: string; userId: string },
  ): any;
  retrieveAll(accountId: string): any;
  update(args: any): any;
  deactivate(accountIntegrationId: string, accountId: string): any;
  activate(accountIntegrationId: string, accountId: string): any;
  delete(accountIntegrationId: string, accountId: string): any;
}
