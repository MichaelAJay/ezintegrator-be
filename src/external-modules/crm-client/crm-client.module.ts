import { Module } from '@nestjs/common';
import { NutshellApiClientModule } from './nutshell-api-client/nutshell-api-client.module';
import { NutshellApiClientService } from './nutshell-api-client/nutshell-api-client.service';

@Module({
  imports: [NutshellApiClientModule],
  exports: [NutshellApiClientService],
})
export class CrmClientModule {}
