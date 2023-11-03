import { Module } from '@nestjs/common';
import { AccountAndCatererModule } from 'src/internal-modules/account-and-caterer/account-and-caterer.module';
import { AccountController } from './account.controller';

@Module({
  imports: [AccountAndCatererModule],
  controllers: [AccountController],
})
export class AccountApiModule {}
