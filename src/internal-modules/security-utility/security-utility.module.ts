import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.module';
import { AccountPermissionService } from './account-permission.service';
import { CryptoUtilityService } from './crypto-utility.service';
import { JwtHandlerService } from './jwt-handler.service';

@Module({
  imports: [JwtModule.register({}), UserDbHandlerModule],
  providers: [
    CryptoUtilityService,
    JwtHandlerService,
    AccountPermissionService,
  ],
  exports: [CryptoUtilityService, JwtHandlerService, AccountPermissionService],
})
export class SecurityUtilityModule {}
