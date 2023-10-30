import { JSONSchemaType } from 'ajv';
import { validateWithAjv } from 'src/utility';
import { ajv } from 'src/utility/singletons';
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
  return validateWithAjv<NutshellApiResponseRequiredFields_CreateLead>(
    data,
    'NutshellApiResponseRequiredFields_CreateLead',
    createLeadNutshellApiResponseValidationFunction,
  );
}
