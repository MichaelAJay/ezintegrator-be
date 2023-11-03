import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';
import { IAuthTokenClaims } from '../interfaces';

const authTokenPayloadSchema: JSONSchemaType<IAuthTokenClaims> = {
  type: 'object',
  properties: {
    iss: { type: 'string' },
    sub: { type: 'string' },
    exp: { type: 'integer' },
  },
  required: ['iss', 'sub'],
  additionalProperties: true,
};

const authTokenPayloadValidator = ajv.compile(authTokenPayloadSchema);
export function validateAuthTokenPayload(
  data: unknown,
): data is IAuthTokenClaims {
  const isValid = authTokenPayloadValidator(data);
  return isValid;
}
