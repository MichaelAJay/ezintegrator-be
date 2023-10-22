import { JSONSchemaType } from 'ajv';
import { validateWithAjv } from 'src/utility';
import { ajv } from 'src/utility/singletons/ajv.singleton';
import { INutshellCredentials } from '../interfaces';

const nutshellCredentialsSchema: JSONSchemaType<INutshellCredentials> = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    apiKeySecretName: { type: 'string' },
  },
  required: ['username', 'apiKeySecretName'],
};

export const nutshellCredentialsSchemaValidationFunction = ajv.compile(
  nutshellCredentialsSchema,
);

export function validateNutshellCredentials(
  data: unknown,
): data is INutshellCredentials {
  return validateWithAjv<INutshellCredentials>(
    data,
    'INutshellCredentials',
    nutshellCredentialsSchemaValidationFunction,
  );
}
