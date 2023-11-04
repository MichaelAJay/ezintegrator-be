import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';
import { IAuthTokenClaims } from '../interfaces';

const authTokenPayloadSchema: JSONSchemaType<IAuthTokenClaims> = {
  type: 'object',
  properties: {
    iss: { type: 'string' },
    sub: { type: 'string' },
    exp: { type: 'integer' },
    acct: { type: 'string' },
  },
  required: ['iss', 'sub', 'acct'],
  additionalProperties: true,
};

const authTokenPayloadValidator = ajv.compile(authTokenPayloadSchema);
export function validateAuthTokenPayload(
  data: unknown,
): data is IAuthTokenClaims {
  const isValid = authTokenPayloadValidator(data);
  return isValid;
}
