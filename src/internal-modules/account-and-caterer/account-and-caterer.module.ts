import { Module } from '@nestjs/common';
import { AccountAndCatererDbHandlerModule } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.module';
import { UserModule } from '../user/user.module';
import { AccountAndCatererService } from './account-and-caterer.service';

@Module({
  imports: [AccountAndCatererDbHandlerModule, UserModule],
  providers: [AccountAndCatererService],
  exports: [AccountAndCatererService],
})
export class AccountAndCatererModule {}
