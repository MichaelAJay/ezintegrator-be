import { Module } from '@nestjs/common';
import { SecretManagerModule } from 'src/external-modules/secret-manager/secret-manager.module';
import { AccountAndCatererDbHandlerModule } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.module';
import { SecurityUtilityModule } from '../security-utility';
import { UserModule } from '../user/user.module';
import { AccountAndCatererService } from './account-and-caterer.service';
import { AccountIntegrationService } from './account-integration.service';
import { AccountSecretService } from './account-secret.service';

@Module({
  imports: [
    AccountAndCatererDbHandlerModule,
    UserModule,
    UserDbHandlerModule,
    SecretManagerModule,
    SecurityUtilityModule,
  ],
  providers: [
    AccountAndCatererService,
    AccountSecretService,
    AccountIntegrationService,
  ],
  exports: [AccountAndCatererService, AccountSecretService],
})
export class AccountAndCatererModule {}
