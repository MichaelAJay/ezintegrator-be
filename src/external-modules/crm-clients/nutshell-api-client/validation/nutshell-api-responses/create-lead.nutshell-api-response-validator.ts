import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../../../utility/singletons';
import { NutshellApiResponseRequiredFields_CreateLead } from '../..';

const createLeadNutshellApiResponseSchema: JSONSchemaType<NutshellApiResponseRequiredFields_CreateLead> =
  {
    type: 'object',
    properties: {
      result: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          entityType: { type: 'string' },
        },
        required: ['id', 'entityType'],
        additionalProperties: true,
      },
    },
    required: ['result'],
    additionalProperties: true,
  };

const createLeadNutshellApiResponseValidationFunction = ajv.compile(
  createLeadNutshellApiResponseSchema,
);

export function validateCreateLeadNutshellResponse(
  data: unknown,
): data is NutshellApiResponseRequiredFields_CreateLead {
  const isValid = createLeadNutshellApiResponseValidationFunction(data);
  return isValid;
}
