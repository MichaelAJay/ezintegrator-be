import { Module } from '@nestjs/common';
import { UserDbHandlerModule } from '../external-handlers/db-handlers/user.db-handler';
import { SecurityUtilityModule } from '../security-utility';
import { AuthService } from './auth.service';

@Module({
  imports: [UserDbHandlerModule, SecurityUtilityModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
