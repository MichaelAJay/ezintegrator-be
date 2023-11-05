import { AccountIntegrationType } from 'src/internal-modules/account-and-caterer/types';

export interface IIntegrationController {
  getIntegrationConfigurationTemplate(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): any;
}
