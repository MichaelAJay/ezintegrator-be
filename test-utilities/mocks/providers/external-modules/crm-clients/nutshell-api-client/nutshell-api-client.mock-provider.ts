import { INutshellApiClientService } from '../../../../../../src/external-modules/crm-clients';

export const mockNutshellApiClient: INutshellApiClientService = {
  getLead: jest.fn(),
  updateLead: jest.fn(),
  createLead: jest.fn(),
  deleteLead: jest.fn(),
  addTaskToEntity: jest.fn(),
  getProducts: jest.fn(),
  tryTwice: jest.fn(),
};
