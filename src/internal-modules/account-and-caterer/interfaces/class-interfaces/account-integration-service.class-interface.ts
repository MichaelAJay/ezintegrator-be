import { PermissionNameValue } from 'src/external-modules/db-client/models/role-and-permission.db-models';
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
    requesterId: string,
  ): any;
  updateAccountIntegrationConfig(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
    config: Record<string, any>,
  ): any;
  deactivate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ): any;
  activate(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ): any;
  delete(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    accountId: string,
    requesterId: string,
  ): any;
  confirmRequesterCanCarryOutAccountIntegrationAction(
    requester: { id: string; accountId: string },
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    permission: PermissionNameValue,
  ): Promise<boolean>;
  accountIntegrationBelongsToUserAccount(
    requesterAccountId: string,
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
  ): Promise<boolean>;
  getAccountIntegrationConfiguration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requesterAccountId: string,
    requesterId: string,
  ): any;
  getAccountIntegrationConfigurations(
    requesterId: string,
    requesterAccountId: string,
    integrationType?: AccountIntegrationType,
  ): any;
}
