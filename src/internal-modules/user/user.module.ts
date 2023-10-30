import { Module } from '@nestjs/common';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler';
import { SecurityUtilityModule } from '../security-utility';
import { UserService } from './user.service';

// DO NOT INJECT AccountAndCatererService
@Module({
  imports: [UserDbHandlerModule, SecurityUtilityModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
