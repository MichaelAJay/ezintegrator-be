import { Injectable } from '@nestjs/common';
import { AccountIntegrationDbHandlerService } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { IAccountIntegrationClass } from './account-integration.class-interface';

@Injectable()
export class AccountCrmIntegratorService implements IAccountIntegrationClass {
  constructor(
    private readonly accountIntegrationDbHandler: AccountIntegrationDbHandlerService,
  ) {}

  create(crmId: string, accountId: string) {
    return this.accountIntegrationDbHandler.addAccountCrm({ accountId, crmId });
  }
  retrieve(args: any) {
    throw new Error('Method not implemented.');
  }
  update(args: any) {
    throw new Error('Method not implemented.');
  }
}
