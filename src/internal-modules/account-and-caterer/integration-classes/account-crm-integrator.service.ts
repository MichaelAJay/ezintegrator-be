import { Injectable } from '@nestjs/common';
import { AccountIntegrationDbHandlerService } from '../../../internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { IAccountIntegrationClass } from './account-integration.class-interface';

@Injectable()
export class AccountCrmIntegratorService implements IAccountIntegrationClass {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
  ) {}

  create(crmId: string, accountId: string) {
    // The FK constraint is handled at the DB level, but should probably be managed here.
    return this.accountIntegrationDbHandler.addAccountCrm({ accountId, crmId });
  }
  retrieveOne(args: any) {
    throw new Error('Method not implemented.');
  }
  async retrieveAll(accountId: string) {
    return this.accountIntegrationDbHandler.retrieveAccountCrms(accountId);
  }
  update(args: any) {
    throw new Error('Method not implemented.');
  }
  async updateConfig(
    integrationId: string,
    accountId: string,
    config: Record<string, any>,
  ) {
    // Retrieve integration by id - include what it references (for instance, Nutshell CRM)
    // Validate the incoming config against the expected config
    // Thoughts on how this update works:
    // 1) It doesn't need to be include all properties.  Missing properties from the config are assumed to represent no change
    // Downside:  If a user just wants to get rid of some information, this won't do it.  But they could just destroy the whole integration
    // 2) Whatever IS included in the config will overwrite anything already stored
    // 3) A check is (?always) performed to determine if the integration's configuration is complete
    // 4) The remaining configuration keys to include are returned, if they exist
  }
}
