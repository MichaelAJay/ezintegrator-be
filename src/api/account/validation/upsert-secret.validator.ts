import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';

export type UpsertAccountSecretPayload = {
  name: string;
  value: string;
};

const upsertAccountSecretSchema: JSONSchemaType<UpsertAccountSecretPayload> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    value: { type: 'string' },
  },
  required: ['name', 'value'],
  additionalProperties: false,
};

export const upsertAccountSecretApiValidator = ajv.compile(
  upsertAccountSecretSchema,
);
