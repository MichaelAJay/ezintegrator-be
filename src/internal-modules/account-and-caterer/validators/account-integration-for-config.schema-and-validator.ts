import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';
import { accountSecretReferenceSecretTypes } from '../../../external-modules';
import { IAccountIntegrationWithConfigAndSystemIntegration } from '../interfaces/account-integration.interface';
import { accountIntegrationValues } from '../types';

const accountIntegrationForConfigSchema: JSONSchemaType<IAccountIntegrationWithConfigAndSystemIntegration> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string', enum: accountIntegrationValues },
      accountId: { type: 'string' },
      nonSensitiveCredentials: {
        anyOf: [{ type: 'object', required: [] }, { type: 'null' }],
      } as any,
      isConfigured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      secretRefs: {
        type: 'array',
        items: {
          type: 'string',
          enum: accountSecretReferenceSecretTypes,
        },
      },
      integration: {
        type: 'object',
        properties: {
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
        },
        required: ['name', 'configurationTemplate'],
        additionalProperties: false,
      },
    },
    required: [
      'id',
      'type',
      'accountId',
      'nonSensitiveCredentials',
      'isConfigured',
      'isActive',
      'secretRefs',
      'integration',
    ],
    additionalProperties: false,
  };

export const validateAccountIntegrationForConfig = ajv.compile(
  accountIntegrationForConfigSchema,
);
