import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { UserDbHandlerService, UserDbQueryBuilderService } from '.';

@Module({
  imports: [DbClientModule],
  providers: [UserDbHandlerService, UserDbQueryBuilderService],
  exports: [UserDbHandlerService],
})
export class UserDbHandlerModule {}
