export function mockReturnGenerateSaltAndHashValue(): {
  hashedValue: string;
  salt: string;
} {
  return {
    hashedValue: 'MOCK_HASHED_VALUE',
    salt: 'MOCK_SALT',
  };
}
