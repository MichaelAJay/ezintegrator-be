import { AccountCrm, AccountCrmSecretReference, Crm } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import { IAccountIntegrationFieldConfigurationJson } from 'src/internal-modules/account-and-caterer/interfaces/account-integration-fields.json-interface';
import { ajv } from 'src/utility/singletons';

export type AccountCrmWithCrmAndSecretRefs = Pick<
  AccountCrm,
  'accountId' | 'nonSensitiveCredentials' | 'isConfigured'
> & {
  crm: { configurationTemplate: IAccountIntegrationFieldConfigurationJson[] };
  crmSecretRefs: Omit<AccountCrmSecretReference, 'accountCrmId'>[];
};

const accountCrmWithCrmAndSecretRefsSchema: JSONSchemaType<AccountCrmWithCrmAndSecretRefs> =
  {
    type: 'object',
    properties: {
      accountId: { type: 'string' },
      nonSensitiveCredentials: { type: 'object' },
      isConfigured: { type: 'boolean' },
      crm: {
        type: 'object',
        properties: {
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
          } as any,
        },
        required: ['configurationTemplate'],
        additionalProperties: true,
      },
      crmSecretRefs: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            secretName: { type: 'string' },
            type: { type: 'string' },
          },
          required: ['secretName', 'type'],
          additionalProperties: true,
        },
      },
    },
    required: [
      'nonSensitiveCredentials',
      'isConfigured',
      'crm',
      'crmSecretRefs',
    ],
    additionalProperties: true,
  };
export const validateAccountCrmWithCrmAndSecretReferences = ajv.compile(
  accountCrmWithCrmAndSecretRefsSchema,
);
