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
}
