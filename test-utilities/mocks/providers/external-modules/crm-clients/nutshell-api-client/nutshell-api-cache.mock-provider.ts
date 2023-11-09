import { INutshellApiCache } from '../../../../../../src/external-modules/crm-clients';

export const mockNutshellApiCacheService: INutshellApiCache = {
  cacheLead: jest.fn(),
  fetchLead: jest.fn(),
  removeLead: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  generateLeadKey: jest.fn(),
};
