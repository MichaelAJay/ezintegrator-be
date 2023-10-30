import { Injectable } from '@nestjs/common';
import { FullAccountModel } from 'src/external-modules/db-client';
import { NUTSHELL_API_METHODS } from './api-methods';
import { INutshellApiClientService, INutshellCredentials } from './interfaces';
import { NutshellApiCacheService } from './nutshell-api-cache.service';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';

@Injectable()
export class NutshellApiClientService implements INutshellApiClientService {
  constructor(
    private readonly clientConfiguration: NutshellApiClientConfigurationService,
    private readonly cache: NutshellApiCacheService,
  ) {}

  // The account credentials should be validated at this point instead of passing them in directly
  async getLead<T>(
    leadId: string,
    account: FullAccountModel,
    accountCredentials: INutshellCredentials,
    validator: (arg: unknown) => arg is T,
  ): Promise<T> {
    // Check cache
    const cachedLead = await this.cache.fetchLead<T>(leadId, account.id);
    if (cachedLead) {
      if (!validator(cachedLead)) {
        // This thrown error is for type safety - the validator should throw its own error on failure
        throw new Error('Cached lead failed validation');
      }
      return cachedLead;
    }

    const client = await this.clientConfiguration.generateClient(
      accountCredentials,
    );
    const response = await client.request(NUTSHELL_API_METHODS.getLead, {
      leadId,
    });
    if (!(response && response.result)) {
      throw new Error('Lead retrieval failed');
    }

    // This may be one layer wrong.
    const lead = response.result;
    if (!validator(lead)) {
      // This thrown error is for type safety - the validator should throw its own error on failure
      throw new Error('Retrieved lead failed validation');
    }

    await this.cache.cacheLead(leadId, account.id, lead);
    return lead;
  }
  updateLead() {
    throw new Error('Method not implemented.');
  }
  createLead() {
    throw new Error('Method not implemented.');
  }
  deleteLead() {
    throw new Error('Method not implemented.');
  }
  addTaskToEntity() {
    throw new Error('Method not implemented.');
  }
  getProducts() {
    throw new Error('Method not implemented.');
  }
  refreshLead() {
    throw new Error('Method not implemented.');
  }
  tryTwice() {
    throw new Error('Method not implemented.');
  }
}
