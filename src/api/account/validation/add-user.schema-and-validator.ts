import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';

export type AddUserRequestBody = {
  email: string;
};

const addUserRequestBodySchema: JSONSchemaType<AddUserRequestBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
};
export const validateAddUserRequestBody = ajv.compile(addUserRequestBodySchema);
