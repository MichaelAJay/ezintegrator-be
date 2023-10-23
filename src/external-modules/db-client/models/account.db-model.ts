import { Account, AccountCrm, AccountEventProcess } from '@prisma/client';

export type AccountDbModel = Account;
export type AccountEventProcessModel = AccountEventProcess;
export type AccountCrmModel = AccountCrm;
export type FullAccountModel = AccountDbModel & {
  crm?: AccountCrmModel;
  processes: AccountEventProcessModel[];
};
