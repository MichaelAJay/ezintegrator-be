import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { OrderDbHandlerService, OrderDbQueryBuilderService } from '.';

@Module({
  imports: [DbClientModule],
  providers: [OrderDbHandlerService, OrderDbQueryBuilderService],
  exports: [OrderDbHandlerService],
})
export class OrderDbHandlerModule {}
