export function mockReturnCreateAccount(
  name: string,
  email: string,
): {
  id: string;
  name: string;
  ownerEmail: string;
  contactEmail: string;
} {
  return {
    id: 'MOCK_ACCT_ID',
    name,
    ownerEmail: email,
    contactEmail: email,
  };
}
