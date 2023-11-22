import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';
import {
  accountSecretReferenceSecretTypes,
  AccountSecretReferenceSecretTypeValues,
} from '../../../external-modules';

export type ValidExistingSecrets = Array<{
  secretName: string;
  type: AccountSecretReferenceSecretTypeValues;
}>;

const existingSecretsSchema: JSONSchemaType<ValidExistingSecrets> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      secretName: { type: 'string' },
      type: {
        type: 'string',
        enum: accountSecretReferenceSecretTypes,
      },
    },
    required: ['type'],
    additionalProperties: true,
  },
};

export const validateExistingSecrets = ajv.compile(existingSecretsSchema);
