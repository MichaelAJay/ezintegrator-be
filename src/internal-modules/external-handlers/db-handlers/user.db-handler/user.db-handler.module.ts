import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { UserDbHandlerService } from './user.db-handler.service';
import { UserDbQueryBuilderService } from './user.db-query-builder.service';

@Module({
  imports: [DbClientModule],
  providers: [UserDbHandlerService, UserDbQueryBuilderService],
  exports: [UserDbHandlerService],
})
export class UserDbHandlerModule {}
