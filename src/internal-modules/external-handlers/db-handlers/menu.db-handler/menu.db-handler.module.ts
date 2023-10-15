import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { MenuDbHandlerService, MenuDbQueryBuilderService } from '.';

@Module({
  imports: [DbClientModule],
  providers: [MenuDbHandlerService, MenuDbQueryBuilderService],
  exports: [MenuDbHandlerService],
})
export class MenuDbHandlerModule {}
