import { IEzManageApiClient } from '../../../../../src/external-modules/ez-manage-api-client/interfaces';

export const mockEzManageApiClientService: IEzManageApiClient = {
  createClient: jest.fn(),
  queryOrder: jest.fn(),
  queryOrderName: jest.fn(),
  getCatererName: jest.fn(),
};
