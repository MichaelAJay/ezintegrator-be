export interface ICryptoUtility {
  generateSaltAndHashValue(
    value: string,
  ): Promise<{ hashedValue: string; salt: string }>;
  generateSalt(): string;
  hash(value: string, salt: string): Promise<string>;
  validateSaltedHash(
    unhashedValue: string,
    hashedValue: string,
    salt: string,
  ): Promise<boolean>;
}
