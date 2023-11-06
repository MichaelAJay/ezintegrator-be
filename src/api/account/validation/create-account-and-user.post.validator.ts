import { JSONSchemaType } from 'ajv';
import { ICreateAccountAndUserArgs } from '../../../internal-modules/account-and-caterer/interfaces';
import { ajv } from '../../../utility/singletons';
const schema: JSONSchemaType<ICreateAccountAndUserArgs> = {
  type: 'object',
  properties: {
    accountName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    firstName: { type: 'string' },
    lastName: {
      anyOf: [{ type: 'string' }, { type: 'null' }],
    } as any,
    password: { type: 'string' },
  },
  required: ['accountName', 'email', 'firstName', 'password'],
  additionalProperties: false,
};

export const createAccountAndUserApiValidator = ajv.compile(schema);
