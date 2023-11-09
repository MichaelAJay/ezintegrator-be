import { RoleNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
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
  deleteAccount(accountId: string): Promise<any>;
  assignAccountToOwner(accountId: string, ownerId: string): any;
  unassignAccountToOwner(accountId: string, ownerId: string): any;
  addUserAccountRole(
    userId: string,
    roleName: RoleNameValue,
    grantorId: string,
  ): any;

  // Account Event Process management
  addAccountEventProcess(args: any): Promise<any>;
  retrieveAccountEventProcesses(args: any): Promise<any>;

  // Caterer management
  createCaterer(args: any): Promise<any>;
  retrieveCaterer(args: any): Promise<any>;
  addCatererPointOfContact(args: any): Promise<any>;
}
