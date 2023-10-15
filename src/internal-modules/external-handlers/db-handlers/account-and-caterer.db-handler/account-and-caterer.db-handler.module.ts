import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import {
  AccountAndCatererDbHandlerService,
  AccountAndCatererDbQueryBuilderService,
} from '.';

@Module({
  imports: [DbClientModule],
  providers: [
    AccountAndCatererDbHandlerService,
    AccountAndCatererDbQueryBuilderService,
  ],
  exports: [AccountAndCatererDbHandlerService],
})
export class AccountAndCatererDbHandlerModule {}
