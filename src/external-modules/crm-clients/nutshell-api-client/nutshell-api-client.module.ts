import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';
import { NutshellApiClientService } from './nutshell-api-client.service';

@Module({
  imports: [CacheModule.register({})],
  providers: [NutshellApiClientService, NutshellApiClientConfigurationService],
  exports: [NutshellApiClientService],
})
export class NutshellApiClientModule {}
