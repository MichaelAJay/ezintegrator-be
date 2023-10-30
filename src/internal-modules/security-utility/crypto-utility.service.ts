import { Injectable } from '@nestjs/common';
import { ICryptoUtility } from '.';
import { pbkdf2, randomBytes } from 'crypto';

@Injectable()
export class CryptoUtilityService implements ICryptoUtility {
  generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  hash(value: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const iterations = 10000;
      const keylen = 64;
      const digest = 'sha512';

      pbkdf2(value, salt, iterations, keylen, digest, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey.toString('hex'));
      });
    });
  }

  async validateSaltedHash(
    unhashedValue: string,
    hashedValue: string,
    salt: string,
  ): Promise<boolean> {
    return (await this.hash(unhashedValue, salt)) === hashedValue;
  }
}
