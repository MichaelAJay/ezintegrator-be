import { IAccountPermissionProvider } from 'src/internal-modules/security-utility';

export const mockAccountPermissionService: IAccountPermissionProvider = {
  canUserEditSecretsForAccount: jest.fn(),
};
