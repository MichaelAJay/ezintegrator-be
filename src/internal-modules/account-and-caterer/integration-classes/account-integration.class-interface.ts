// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(integrationId: string, accountId: string): any;
  retrieveOne(integrationId: string): any;
  retrieveAll(accountId: string): any;
  update(args: any): any;
  updateConfig(
    integrationId: string,
    accountId: string,
    config: Record<string, any>,
  ): any;
  deactivate(integrationId: string, accountId: string): any;
  activate(integrationId: string, accountId: string): any;
  delete(integrationId: string, accountId: string): any;
}
