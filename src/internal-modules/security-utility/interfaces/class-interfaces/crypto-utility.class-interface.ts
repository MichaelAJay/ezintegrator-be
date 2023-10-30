export interface ICryptoUtility {
  generateSalt(): string;
  hash(value: string, salt: string): Promise<string>;
  validateSaltedHash(
    unhashedValue: string,
    hashedValue: string,
    salt: string,
  ): Promise<boolean>;
}
