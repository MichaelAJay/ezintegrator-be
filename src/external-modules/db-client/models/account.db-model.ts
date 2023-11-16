import {
  Account,
  AccountCrm,
  AccountSecretReferenceSecretType,
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
