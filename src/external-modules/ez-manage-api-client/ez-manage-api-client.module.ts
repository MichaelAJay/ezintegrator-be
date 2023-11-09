import { Module } from '@nestjs/common';
import { EzManageApiClientService } from './ez-manage-api-client.service';

@Module({
  providers: [EzManageApiClientService],
})
export class EzManageApiClientModule {}
