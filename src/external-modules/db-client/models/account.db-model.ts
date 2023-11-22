import {
  Account,
  AccountCrm,
  IntegrationSecretReferenceSecretType,
  IntegrationSecretReferenceSecretType as AccountSecretReferenceSecretTypeConstant,
  AccountStatus,
} from '@prisma/client';

export type AccountDbModel = Account;
export type AccountCrmModel = AccountCrm;
export type FullAccountModel = AccountDbModel & {
  crm?: AccountCrmModel;
};

export type AccountSecretReferenceSecretTypeValues =
  IntegrationSecretReferenceSecretType;

export type AccountStatusValues = AccountStatus;

const accountSecretReferenceSecretTypeConst =
  AccountSecretReferenceSecretTypeConstant;
export const accountSecretReferenceSecretTypes = Object.values(
  accountSecretReferenceSecretTypeConst,
);
