import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';

const generalObjectPayloadSchema: JSONSchemaType<Record<string, any>> = {
  type: 'object',
  additionalProperties: true,
};

export const validateGeneralObjectPayload = ajv.compile(
  generalObjectPayloadSchema,
);
