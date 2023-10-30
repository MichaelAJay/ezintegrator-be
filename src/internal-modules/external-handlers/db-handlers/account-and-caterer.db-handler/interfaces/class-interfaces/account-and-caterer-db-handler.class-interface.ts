import { IBuildCreateAccountQueryArgs } from '../method-interfaces';

export interface IAccountAndCatererDbHandler {
  // Account management
  createAccount(args: IBuildCreateAccountQueryArgs): Promise<any>;
  retrieveAccount(args: any): Promise<any>;
  updateAccount(args: any): Promise<any>; // Only the user with corresponding email to contactEmail

  // Account Event Process management
  addAccountEventProcess(args: any): Promise<any>;
  retrieveAccountEventProcesses(args: any): Promise<any>;

  // Account Crm management
  addAccountCrm(args: any): Promise<any>;

  // Account Secret Reference management
  upsertAccountSecretReference(args: any): Promise<any>;
  retrieveAccountSecretReference(args: any): Promise<any>;

  // Caterer management
  createCaterer(args: any): Promise<any>;
  retrieveCaterer(args: any): Promise<any>;
  addCatererPointOfContact(args: any): Promise<any>;
}
