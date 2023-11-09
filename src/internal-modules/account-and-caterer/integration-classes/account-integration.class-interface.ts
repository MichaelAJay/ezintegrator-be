// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(integrationId: string, accountId: string): any;
  retrieveOne(args: any): any;
  retrieveAll(accountId: string): any;
  update(args: any): any;
}
