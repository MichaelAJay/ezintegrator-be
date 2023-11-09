import { FullAccountModel } from '../../../../../external-modules';
import { INutshellCredentials } from '../nutshell-credentials.interface';

export interface INutshellApiClientService {
  getLead(
    leadId: string,
    account: FullAccountModel,
    accountCredentials: INutshellCredentials,
    validator: (arg: unknown) => boolean,
  ): any;
  updateLead(): any;
  createLead(): any;
  deleteLead(): any;
  addTaskToEntity(): any;
  getProducts(): any;
  tryTwice(): any;
}
