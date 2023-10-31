import { ICreateUserDbQueryBuilderArgs } from 'src/internal-modules/external-handlers/db-handlers/user.db-handler';

export function mockReturnRetrieveUserByEmail(
  email: string,
  returnNull: boolean,
): {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  hashedPassword: string;
  hashedRt: string | null;
  salt: string;
  accountId: string;
} | null {
  if (returnNull) {
    return null;
  }
  return {
    id: 'MOCK_USER_ID',
    email,
    firstName: 'MOCK_FN',
    lastName: 'MOCK_LN',
    hashedPassword: 'MOCK_HPW',
    hashedRt: 'MOCK_HRT',
    salt: 'MOCK_SALT',
    accountId: 'MOCK_ACCT_ID',
  };
}

export function mockReturnCreateUser(args: ICreateUserDbQueryBuilderArgs): {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  hashedPassword: string;
  hashedRt: string | null;
  salt: string;
  accountId: string;
} {
  return {
    ...args,
    id: 'MOCK_USER_ID',
    lastName: null,
    hashedRt: null,
  };
}
