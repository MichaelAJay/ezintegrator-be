// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(integrationId: string, accountId: string): any;
  retrieve(args: any): any;
  update(args: any): any;
}
