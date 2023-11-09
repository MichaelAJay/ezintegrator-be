import Ajv, { FormatDefinition } from 'ajv';

const emailFormat: FormatDefinition<string> = {
  validate: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

export const ajv = new Ajv({ allErrors: true });
ajv.addFormat('email', emailFormat);
