import { Module } from '@nestjs/common';
import { CrmClientService } from './crm-client.service';
import { NutshellApiClientModule } from './nutshell-api-client/nutshell-api-client.module';

@Module({
  imports: [NutshellApiClientModule],
  providers: [CrmClientService],
  exports: [CrmClientService],
})
export class CrmClientModule {}
