import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';
import { IAccountIntegrationFieldConfigurationJson } from '../interfaces/account-integration-fields.json-interface';

const accountIntegrationConfigurationTemplateSchema: JSONSchemaType<
  IAccountIntegrationFieldConfigurationJson[]
> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      fieldName: { type: 'string' },
      description: { type: 'string' },
      isSecret: { type: 'boolean' },
    },
    required: ['fieldName', 'description', 'isSecret'],
    additionalProperties: false,
  },
};
export const validateAccountIntegrationConfigurationTemplateJSONArray =
  ajv.compile(accountIntegrationConfigurationTemplateSchema);
