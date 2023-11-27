import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';
import { INutshellCredentials } from '../nutshell-api-client';

const nutshellCredentialsSchema: JSONSchemaType<INutshellCredentials> = {
  type: 'object',
  properties: {
    apiKeySecretName: { type: 'string' },
    username: { type: 'string' },
  },
  required: ['apiKeySecretName', 'username'],
  additionalProperties: false,
};

export const nutshellCredentialsValidator = ajv.compile(
  nutshellCredentialsSchema,
);
