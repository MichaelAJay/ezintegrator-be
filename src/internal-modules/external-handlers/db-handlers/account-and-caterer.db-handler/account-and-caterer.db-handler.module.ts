import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { AccountAndCatererDbHandlerService } from './account-and-caterer.db-handler.service';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';

import { AccountSecretDbHandlerService } from './account-secret.db-handler.service';
import { AccountSecretDbQueryBuilderService } from './account-secret.db-query-builder.service';

@Module({
  imports: [DbClientModule],
  providers: [
    AccountAndCatererDbHandlerService,
    AccountAndCatererDbQueryBuilderService,
    AccountSecretDbHandlerService,
    AccountSecretDbQueryBuilderService,
  ],
  exports: [AccountAndCatererDbHandlerService, AccountSecretDbHandlerService],
})
export class AccountAndCatererDbHandlerModule {}
