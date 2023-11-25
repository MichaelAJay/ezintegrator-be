import { Module } from '@nestjs/common';
import { SecretManagerModule } from '../../external-modules/secret-manager/secret-manager.module';
import { AccountAndCatererDbHandlerModule } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { RoleAndPermissionDbHandlerModule } from '../external-handlers/db-handlers/role-and-permission.db-handler/role-and-permission.db-handler.module';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.module';
import { SecurityUtilityModule } from '../security-utility';
import { UserModule } from '../user/user.module';
import { AccountAndCatererService } from './account-and-caterer.service';
import { AccountIntegrationHelperService } from './account-integration-helper/account-integration-helper.service';
import { AccountIntegrationService } from './account-integration.service';
import { AccountSecretService } from './account-secret.service';
import { AccountIntegratorsModule } from './integration-classes/account-integrators.module';
import { AccountIntegrationHelperModule } from './account-integration-helper/account-integration-helper.module';

@Module({
  imports: [
    AccountAndCatererDbHandlerModule,
    UserModule,
    UserDbHandlerModule,
    SecretManagerModule,
    SecurityUtilityModule,
    AccountIntegratorsModule,
    RoleAndPermissionDbHandlerModule,
    AccountIntegrationHelperModule,
  ],
  providers: [
    AccountAndCatererService,
    AccountSecretService,
    AccountIntegrationService,
    AccountIntegrationHelperService,
  ],
  exports: [
    AccountAndCatererService,
    AccountSecretService,
    AccountIntegrationService,
  ],
})
export class AccountAndCatererModule {}
