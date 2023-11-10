import { AccountIntegrationType } from '../../types';
import { IAccountIntegrationFieldConfigurationJson } from '../account-integration-fields.json-interface';

export interface IAccountIntegrationProvider {
  getAccountIntegration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    tokenAccountId: string,
    userId: string,
  ): Promise<any>;
  isAccountCrmFullyConfigured(
    accountCrmId: string,
    accountId: string,
    userId: string,
  ): Promise<{
    isFullyConfigured: boolean;
    missingConfigs?: IAccountIntegrationFieldConfigurationJson[];
  }>;
  createAccountIntegration(
    integrationType: AccountIntegrationType,
    integrationId: string,
    accountId: string,
    requesterId: string,
  ): any;
  getAccountIntegrationsOfType(
    integrationType: AccountIntegrationType,
    accountId: string,
  ): any;
}
