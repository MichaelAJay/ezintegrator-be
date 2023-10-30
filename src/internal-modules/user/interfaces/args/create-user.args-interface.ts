import { ICreateUserDbQueryBuilderArgs } from '../../../../internal-modules/external-handlers/db-handlers/user.db-handler';

export type ICreateUserArgs = Omit<
  ICreateUserDbQueryBuilderArgs,
  'hashedPassword' | 'salt'
> & {
  password: string;
};
