import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';
import { ICreateAccountIntegrationReturn } from '../interfaces';
import { accountIntegrationValues } from '../types';

const createAccountIntegrationResponseSchema: JSONSchemaType<ICreateAccountIntegrationReturn> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string', enum: accountIntegrationValues },
      isConfigured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      integration: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          configurationTemplate: {
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
          },
          validEventProcesses: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: [
          'id',
          'name',
          'configurationTemplate',
          'validEventProcesses',
        ],
        additionalProperties: false,
      },
    },
    required: ['id', 'type', 'isConfigured', 'isActive', 'integration'],
    additionalProperties: false,
  };

export const createAccountIntegrationResponseValidator = ajv.compile(
  createAccountIntegrationResponseSchema,
);
