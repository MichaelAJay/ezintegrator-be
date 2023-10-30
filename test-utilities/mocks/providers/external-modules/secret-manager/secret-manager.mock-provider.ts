import { ISecretManagerProvider } from '../../../../../src/external-modules/secret-manager';

export const mockSecretManagerService: ISecretManagerProvider = {
  upsertSecretVersion: jest.fn(),
  addSecretVersion: jest.fn(),
  createSecretContainer: jest.fn(),
  getSecret: jest.fn(),
  getSecretLocally: jest.fn(),
  getRemoteSecret: jest.fn(),
};
