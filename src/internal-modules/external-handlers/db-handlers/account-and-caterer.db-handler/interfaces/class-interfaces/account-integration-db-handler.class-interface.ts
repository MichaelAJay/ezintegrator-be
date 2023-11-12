import { AccountCrm, Prisma } from '@prisma/client';
import { AccountIntegrationType } from 'src/internal-modules/account-and-caterer/types';

export interface IAccountIntegrationDbHandlerProvider {
  // Account CRM management
  addAccountCrm(
    data: Pick<Prisma.AccountCrmUncheckedCreateInput, 'accountId' | 'crmId'>,
  ): Promise<any>;
  retrieveAccountCrms(accountId: string): Promise<AccountCrm[]>;
  retrieveAccountCrmById(
    accountCrmId: string,
    include?: Prisma.AccountCrmInclude,
  ): Promise<AccountCrm | null>;
  updateAccountCrm(
    accountCrmId: string,
    accountId: string,
    updates: Pick<
      Prisma.AccountCrmUncheckedUpdateInput,
      'nonSensitiveCredentials' | 'isConfigured' | 'isActive'
    >,
  ): Promise<any>;
  retrieveAllTargetAccountIntegrationSecretReferences(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): any;
  deleteAccountIntegration(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): any;
  retrieveAccountIntegrationsAndSecretReferencesByType(
    accountId: string,
    type: AccountIntegrationType,
  ): any;
}
