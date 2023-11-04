import {
  Account,
  AccountCrm,
  AccountEventProcess,
  AccountSecretReferenceSecretType,
  AccountSecretReferenceTargetType as AccountSecretReferenceTargetTypeType,
} from '@prisma/client';

export type AccountDbModel = Account;
export type AccountEventProcessModel = AccountEventProcess;
export type AccountCrmModel = AccountCrm;
export type FullAccountModel = AccountDbModel & {
  crm?: AccountCrmModel;
  processes: AccountEventProcessModel[];
};

export type AccountSecretReferenceTargetTypeValues =
  AccountSecretReferenceTargetTypeType;
export type AccountSecretReferenceSecretTypeValues =
  AccountSecretReferenceSecretType;
