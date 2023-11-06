import {
  Account,
  AccountCrm,
  AccountEventProcess,
  AccountSecretReferenceSecretType,
  AccountStatus,
} from '@prisma/client';

export type AccountDbModel = Account;
export type AccountEventProcessModel = AccountEventProcess;
export type AccountCrmModel = AccountCrm;
export type FullAccountModel = AccountDbModel & {
  crm?: AccountCrmModel;
  processes: AccountEventProcessModel[];
};

export type AccountSecretReferenceSecretTypeValues =
  AccountSecretReferenceSecretType;

export type AccountStatusValues = AccountStatus;
