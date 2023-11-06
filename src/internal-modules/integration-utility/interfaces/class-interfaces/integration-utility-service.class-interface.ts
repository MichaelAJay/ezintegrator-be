import { IAccountIntegrationFieldConfigurationJson } from 'src/internal-modules/account-and-caterer/interfaces/account-integration-fields.json-interface';
import { AccountIntegrationType } from 'src/internal-modules/account-and-caterer/types';

export interface IIntegrationUtilityProvider {
  getIntegrationConfigurationRequirements(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): Promise<IAccountIntegrationFieldConfigurationJson[]>;
}
