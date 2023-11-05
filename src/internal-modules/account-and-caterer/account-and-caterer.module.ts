import { Module } from '@nestjs/common';
import { SecretManagerModule } from 'src/external-modules/secret-manager/secret-manager.module';
import { AccountAndCatererDbHandlerModule } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { CrmIntegrationDbHandlerModule } from '../external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.module';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.module';
import { SecurityUtilityModule } from '../security-utility';
import { UserModule } from '../user/user.module';
import { AccountAndCatererService } from './account-and-caterer.service';
import { AccountSecretService } from './account-secret.service';

@Module({
  imports: [
    AccountAndCatererDbHandlerModule,
    UserModule,
    UserDbHandlerModule,
    CrmIntegrationDbHandlerModule,
    SecretManagerModule,
    SecurityUtilityModule,
  ],
  providers: [AccountAndCatererService, AccountSecretService],
  exports: [AccountAndCatererService, AccountSecretService],
})
export class AccountAndCatererModule {}
