import { JSONSchemaType } from 'ajv';
import { ILoginArgs } from '../../../internal-modules/auth/interfaces';
import { ajv } from '../../../utility/singletons';

const loginSchema: JSONSchemaType<ILoginArgs> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
};

export const validateLoginRequestPayload = ajv.compile(loginSchema);
