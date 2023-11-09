import { JSONSchemaType } from 'ajv';
import { ICreateUserArgs } from '../../../internal-modules/user/interfaces';
import { ajv } from '../../../utility/singletons';

export type CreateAccountUserRequestPayload = Omit<
  ICreateUserArgs,
  'password' | 'accountId'
>;
const addUserRequestBodySchema: JSONSchemaType<CreateAccountUserRequestPayload> =
  {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      } as any,
      email: { type: 'string', format: 'email' },
    },
    required: ['firstName', 'email'],
    additionalProperties: false,
  };
export const validateAddUserRequestBody = ajv.compile(addUserRequestBodySchema);
