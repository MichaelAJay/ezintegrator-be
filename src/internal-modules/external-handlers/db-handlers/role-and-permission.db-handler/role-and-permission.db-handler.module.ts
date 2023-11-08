import { Module } from '@nestjs/common';
import { DbClientModule } from 'src/external-modules';
import { RoleAndPermissionDbHandlerService } from './role-and-permission.db-handler.service';
import { RoleAndPermissionDbQueryBuilderService } from './role-and-permission.db-query-builder.service';

@Module({
  imports: [DbClientModule],
  providers: [
    RoleAndPermissionDbHandlerService,
    RoleAndPermissionDbQueryBuilderService,
  ],
  exports: [RoleAndPermissionDbHandlerService],
})
export class RoleAndPermissionDbHandlerModule {}
