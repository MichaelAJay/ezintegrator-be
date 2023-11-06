import { IIntegrationUtilityProvider } from '../../../../../src/internal-modules/integration-utility/interfaces/class-interfaces/integration-utility-service.class-interface';

export const mockIntegrationUtilityService: IIntegrationUtilityProvider = {
  getIntegrationConfigurationRequirements: jest.fn(),
};
