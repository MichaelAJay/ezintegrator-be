import { JSONSchemaType } from 'ajv';
import { accountSecretReferenceTypeValues } from 'src/external-modules/db-client/types/account-secret.types';
import { IAddCrmSecretArgs } from 'src/internal-modules/account-and-caterer/interfaces';
import { accountIntegrationValues } from 'src/internal-modules/account-and-caterer/types';
import { ajv } from 'src/utility/singletons';

const addSecretRequestPayloadSchema: JSONSchemaType<IAddCrmSecretArgs> = {
  type: 'object',
  properties: {
    secret: { type: 'string' },
    integrationType: { type: 'string', enum: accountIntegrationValues },
    secretType: { type: 'string', enum: accountSecretReferenceTypeValues },
    accountIntegrationId: { type: 'string' },
  },
  required: ['secret', 'integrationType', 'secretType', 'accountIntegrationId'],
  additionalProperties: false,
};
export const addSecretRequestPayloadValidator = ajv.compile(
  addSecretRequestPayloadSchema,
);
