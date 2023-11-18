import {
  IAccountIntegrationFieldConfigurationJson,
  ICreateAccountIntegrationReturn,
} from '../interfaces';

// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(
    integrationId: string,
    accountId: string,
  ): Promise<ICreateAccountIntegrationReturn>;
  retrieveOne(
    integrationId: string,
    requester: { accountId: string; userId: string },
  ): any;
  retrieveAll(accountId: string): any;
  update(args: any): any;
  updateConfig(
    integrationId: string,
    accountId: string,
    config: Record<string, any>,
  ): any;
  deactivate(integrationId: string, accountId: string): any;
  activate(integrationId: string, accountId: string): any;
  delete(integrationId: string, accountId: string): any;
  isAccountIntegrationFullyConfigured(
    accountIntegrationId: string,
    requester: { userId: string; accountId: string },
  ): Promise<{
    isFullyConfigured: boolean;
    missingConfigs?: IAccountIntegrationFieldConfigurationJson[] | undefined;
  }>;
}
