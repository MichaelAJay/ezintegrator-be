import { Module } from '@nestjs/common';
import { AccountAndCatererDbHandlerModule } from 'src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { AccountCrmIntegratorService } from './account-crm-integrator.service';

@Module({
  imports: [AccountAndCatererDbHandlerModule],
  providers: [AccountCrmIntegratorService],
  exports: [AccountCrmIntegratorService],
})
export class AccountIntegratorsModule {}
