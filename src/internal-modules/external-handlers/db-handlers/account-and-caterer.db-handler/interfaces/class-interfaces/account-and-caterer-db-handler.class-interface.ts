import { IBuildCreateAccountQueryArgs } from '../method-interfaces';

export interface IAccountAndCatererDbHandler {
  // Account management
  createAccount(args: IBuildCreateAccountQueryArgs): Promise<{
    id: string;
    name: string;
    ownerEmail: string;
    contactEmail: string;
  }>;
  retrieveAccount(args: any): Promise<any>;
  updateAccount(args: any): Promise<any>; // Only the user with corresponding email to contactEmail
  assignAccountToOwner(accountId: string, ownerId: string): any;
  unassignAccountToOwner(accountId: string, ownerId: string): any;

  // Account Event Process management
  addAccountEventProcess(args: any): Promise<any>;
  retrieveAccountEventProcesses(args: any): Promise<any>;

  // Caterer management
  createCaterer(args: any): Promise<any>;
  retrieveCaterer(args: any): Promise<any>;
  addCatererPointOfContact(args: any): Promise<any>;
}
