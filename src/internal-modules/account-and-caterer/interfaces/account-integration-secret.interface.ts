import { AccountSecretReferenceTypeValues } from 'src/external-modules/db-client/types/account-secret.types';

export type IAccountIntegrationSecret = {
  type: AccountSecretReferenceTypeValues;
  secretName: string; // DO NOT LEAK
};
