import { Injectable } from '@nestjs/common';
import { INutshellApiClientService } from './interfaces';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';

@Injectable()
export class NutshellApiClientService implements INutshellApiClientService {
  constructor(
    private readonly nutshellApiClientConfiguration: NutshellApiClientConfigurationService,
  ) {}

  getLead() {
    throw new Error('Method not implemented.');
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
  internalLeadFetcher() {
    throw new Error('Method not implemented.');
  }
  retrieveLeadFromCache() {
    throw new Error('Method not implemented.');
  }
  cacheLead() {
    throw new Error('Method not implemented.');
  }
  refreshLead() {
    throw new Error('Method not implemented.');
  }
  tryTwice() {
    throw new Error('Method not implemented.');
  }
}
