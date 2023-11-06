import { AccountStatusValues } from '../../../../../../src/external-modules';

export function mockReturnCreateAccount(
  name: string,
  email: string,
): {
  id: string;
  name: string;
  status: AccountStatusValues;
  ownerEmail: string;
  contactEmail: string;
} {
  return {
    id: 'MOCK_ACCT_ID',
    name,
    status: 'PENDING',
    ownerEmail: email,
    contactEmail: email,
  };
}
