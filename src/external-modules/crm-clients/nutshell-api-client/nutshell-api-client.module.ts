import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { SecretManagerModule } from '../../../external-modules/secret-manager/secret-manager.module';
import { NutshellApiCacheService } from './nutshell-api-cache.service';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';
import { NutshellApiClientService } from './nutshell-api-client.service';

@Module({
  imports: [CacheModule.register({}), SecretManagerModule],
  providers: [
    NutshellApiClientService,
    NutshellApiClientConfigurationService,
    NutshellApiCacheService,
  ],
  exports: [NutshellApiClientService],
})
export class NutshellApiClientModule {}
