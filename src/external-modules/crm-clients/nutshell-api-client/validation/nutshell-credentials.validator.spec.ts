import { INutshellCredentials } from '../interfaces';
import { validateNutshellCredentials } from './nutshell-credentials.validator';

describe('validateNutshellCredentials unit tests', () => {
  describe('valid data', () => {
    it('returns true', async () => {
      const validCredentials: INutshellCredentials = {
        username: 'USERNAME EXISTS',
        apiKeySecretName: 'API KEY SECRET NAME EXISTS',
      };

      expect(validateNutshellCredentials(validCredentials)).toBe(true);
    });
  });
  describe('invalid data', () => {
    it('throws error with message "Data failed validation"', async () => {
      const invalidResponse = {
        userName: 'NOTE CASING',
      };
      const result = validateNutshellCredentials(invalidResponse);
      expect(result).toBe(false);
    });
  });
});
