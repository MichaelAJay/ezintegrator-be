import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { INutshellApiClientConfigurationService } from '.';

@Injectable()
export class NutshellApiClientConfigurationService
  implements INutshellApiClientConfigurationService
{
  private cacheTTL_in_MS: number;
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    this.cacheTTL_in_MS = 20 * 60 * 1000;
  }
  async generateClient() {
    throw new Error('Method not implemented.');
  }
  async getApiForUsername() {
    throw new Error('Method not implemented.');
  }
  selectDomain() {
    throw new Error('Method not implemented.');
  }
  isGetApiForUsernameResponseValid() {
    throw new Error('Method not implemented.');
  }
  getBasicAuthValue() {
    throw new Error('Method not implemented.');
  }
  getUsernameAndApiKeyForAcct() {
    throw new Error('Method not implemented.');
  }
}
