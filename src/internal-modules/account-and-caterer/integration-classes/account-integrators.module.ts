import { Module } from '@nestjs/common';
import { SecretManagerModule } from 'src/external-modules/secret-manager/secret-manager.module';
import { AccountAndCatererDbHandlerModule } from '../../../internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { AccountIntegrationHelperModule } from '../account-integration-helper/account-integration-helper.module';
import { AccountCrmIntegratorService } from './account-crm-integrator/account-crm-integrator.service';

@Module({
  imports: [
    AccountAndCatererDbHandlerModule,
    SecretManagerModule,
    AccountIntegrationHelperModule,
  ],
  providers: [AccountCrmIntegratorService],
  exports: [AccountCrmIntegratorService],
})
export class AccountIntegratorsModule {}
