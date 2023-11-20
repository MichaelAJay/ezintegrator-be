import { JSONSchemaType } from 'ajv';
import { accountSecretReferenceSecretTypes } from '../../../external-modules';
import { eventValues } from '../../../external-modules/db-client/models/event.db-models';
import { crmIntegrationActions } from '../../../external-modules/db-client/types/crm-integration-action.type';
import { ajv } from '../../../utility/singletons';
import { IAccountIntegration } from '../interfaces/account-integration.interface';
import { accountIntegrationValues } from '../types';

const generalizedAccountIntegrationSchema: JSONSchemaType<IAccountIntegration> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      type: { type: 'string', enum: accountIntegrationValues },
      accountId: { type: 'string' },
      // This is done
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
      eventProcesses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            event: { type: 'string', enum: eventValues },
            actions: {
              type: 'array',
              items: {
                type: 'string',
                enum: crmIntegrationActions,
              },
            },
          },
          required: ['event', 'actions'],
          additionalProperties: false,
        },
      },
      // Integration is good
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
          validEventProcesses: {
            type: 'array',
            items: {
              type: 'string',
              enum: crmIntegrationActions,
            },
          },
        },
        required: [],
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
      'eventProcesses',
      'integration',
    ],
    additionalProperties: false,
  };

export const validateGeneralizedAccountIntegration = ajv.compile(
  generalizedAccountIntegrationSchema,
);
