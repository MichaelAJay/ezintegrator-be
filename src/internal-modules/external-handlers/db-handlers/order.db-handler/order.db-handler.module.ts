import { Module } from '@nestjs/common';
import { DbClientModule } from '../../../../external-modules';
import { OrderDbHandlerService, OrderDbQueryBuilderService } from '.';
import { OrderTargetDbHandlerService } from './order-target/order-target.db-handler.service';
import { OrderTargetDbQueryBuilderService } from './order-target/order-target.db-query-builder.service';

@Module({
  imports: [DbClientModule],
  providers: [
    OrderDbHandlerService,
    OrderDbQueryBuilderService,
    OrderTargetDbHandlerService,
    OrderTargetDbQueryBuilderService,
  ],
  exports: [OrderDbHandlerService],
})
export class OrderDbHandlerModule {}
