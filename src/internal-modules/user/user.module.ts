import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.module';
import { SecurityUtilityModule } from '../security-utility';
import { UserService } from './user.service';

// DO NOT INJECT AccountAndCatererService
@Module({
  imports: [UserDbHandlerModule, SecurityUtilityModule, AuthModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
