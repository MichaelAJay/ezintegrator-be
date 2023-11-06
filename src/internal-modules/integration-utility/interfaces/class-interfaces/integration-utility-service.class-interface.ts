import { IAccountIntegrationFieldConfigurationJson } from '../../../../internal-modules/account-and-caterer/interfaces/account-integration-fields.json-interface';
import { AccountIntegrationType } from '../../../../internal-modules/account-and-caterer/types';

export interface IIntegrationUtilityProvider {
  getIntegrationConfigurationRequirements(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): Promise<IAccountIntegrationFieldConfigurationJson[]>;
}
