import { AccountIntegrationType } from '../../types';
import { GetAccountIntegrationReturn } from '../method-returns/account-integration-helper/get-account-integration.method-return';

export interface IAccountIntegrationProvider {
  /**
   * @check accountId is not leaked in return
   */
  getAccountIntegration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requester: {
      accountId: string;
      userId: string;
    },
  ): Promise<GetAccountIntegrationReturn>;
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
    requester: {
      accountId: string;
      userId: string;
    },
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
  // These two should probably be helper functions, but they should take records and not make DB calls
  // Maybe it's ok to make DB calls...
  getAccountIntegrationConfiguration(
    integrationType: AccountIntegrationType,
    accountIntegrationId: string,
    requester: {
      accountId: string;
      userId: string;
    },
  ): any;
  getAccountIntegrationConfigurations(
    requesterId: string,
    requesterAccountId: string,
    integrationType?: AccountIntegrationType,
  ): any;
}
