import { AccountSecretReferenceSecretTypeValues } from '../../../external-modules';

// All specific account integration providers (ex: AccountCrm) should implement this interface
export interface IAccountIntegrationClass {
  create(integrationId: string, accountId: string): Promise<any>;
  retrieveOne(
    accountIntegrationId: string,
    requester: { accountId: string; userId: string },
  ): any;
  retrieveAll(accountId: string): any;
  update(args: any): any;
  /**
   * @precondition the requesting user has necessary permission
   * @check the target accountIntegration belongs to the same account as the requesting user
   */
  updateConfig(
    accountIntegrationId: string,
    requester: { accountId: string; userId: string },
    configUpdate: Record<string, any>,
  ): any;
  deactivate(accountIntegrationId: string, accountId: string): any;
  /**
   * @check accountIntegration isConfigured & isExternallyChecked are true
   */
  activate(accountIntegrationId: string, accountId: string): any;
  delete(accountIntegrationId: string, accountId: string): any;
  /**
   * @check existingSecrets is an array and every secret in existingSecrets is an object with "type" property
   */
  handleSecretsUpdate(
    accountIntegrationId: string,
    existingSecrets: Array<any>,
    incomingSecrets: Array<{
      type: AccountSecretReferenceSecretTypeValues;
      secret: any;
    }>,
  ): any;
  /**
   * Performs an idempotent action on the external integration to confirm that the integration is fully configured
   * @check accountIntegration.isConfigured is true
   */
  checkConfigurationExternally(): Promise<boolean>;
}
