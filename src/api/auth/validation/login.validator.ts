import { JSONSchemaType } from 'ajv';
import { ILoginArgs } from 'src/internal-modules/auth/interfaces';
import { ajv } from 'src/utility/singletons';

const loginSchema: JSONSchemaType<ILoginArgs> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
};

export const validateLoginRequestPayload = ajv.compile(loginSchema);
