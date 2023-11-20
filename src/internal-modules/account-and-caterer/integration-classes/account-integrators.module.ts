import { Module } from '@nestjs/common';
import { SecretManagerModule } from 'src/external-modules/secret-manager/secret-manager.module';
import { AccountAndCatererDbHandlerModule } from '../../../internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { AccountCrmIntegratorService } from './account-crm-integrator/account-crm-integrator.service';
import { AccountIntegrationMapperService } from './account-integration-mapper.service';

@Module({
  imports: [AccountAndCatererDbHandlerModule, SecretManagerModule],
  providers: [AccountCrmIntegratorService, AccountIntegrationMapperService],
  exports: [AccountCrmIntegratorService, AccountIntegrationMapperService],
})
export class AccountIntegratorsModule {}
