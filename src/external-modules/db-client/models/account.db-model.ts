import {
  Account,
  AccountCrm,
  AccountSecretReferenceSecretType,
  AccountSecretReferenceSecretType as AccountSecretReferenceSecretTypeConstant,
  AccountStatus,
} from '@prisma/client';

export type AccountDbModel = Account;
export type AccountCrmModel = AccountCrm;
export type FullAccountModel = AccountDbModel & {
  crm?: AccountCrmModel;
};

export type AccountSecretReferenceSecretTypeValues =
  AccountSecretReferenceSecretType;

export type AccountStatusValues = AccountStatus;

const accountSecretReferenceSecretTypeConst =
  AccountSecretReferenceSecretTypeConstant;
export const accountSecretReferenceSecretTypes = Object.values(
  accountSecretReferenceSecretTypeConst,
);
