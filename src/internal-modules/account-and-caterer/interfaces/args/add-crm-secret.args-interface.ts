import { AccountSecretReferenceTypeValues } from 'src/external-modules/db-client/types/account-secret.types';
import { AccountIntegrationType } from '../../types';

export interface IAddCrmSecretArgs {
  secret: string;
  integrationType: AccountIntegrationType;
  secretType: AccountSecretReferenceTypeValues;
  accountIntegrationId: string;
}
