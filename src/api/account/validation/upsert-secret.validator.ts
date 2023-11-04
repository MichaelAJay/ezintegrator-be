import { JSONSchemaType } from 'ajv';
import {
  AccountSecretReferenceSecretTypeValues,
  AccountSecretReferenceTargetTypeValues,
} from 'src/external-modules';
import { ajv } from 'src/utility/singletons';

export type UpsertAccountSecretPayload = {
  referenceType: AccountSecretReferenceTargetTypeValues;
  secretType: AccountSecretReferenceSecretTypeValues;
  value: string;
};

const upsertAccountSecretSchema: JSONSchemaType<UpsertAccountSecretPayload> = {
  type: 'object',
  properties: {
    referenceType: { type: 'string', enum: ['CRM'] },
    secretType: { type: 'string', enum: ['API_KEY'] },
    value: { type: 'string' },
  },
  required: ['referenceType', 'secretType', 'value'],
  additionalProperties: false,
};

export const upsertAccountSecretApiValidator = ajv.compile(
  upsertAccountSecretSchema,
);
