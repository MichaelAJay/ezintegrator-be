import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';
import {
  AccountIntegrationType,
  accountIntegrationValues,
} from '../../../internal-modules/account-and-caterer/types';

export type CreateAccountIntegration = {
  integrationType: AccountIntegrationType;
  integrationId: string;
};

const createAccountIntegrationSchema: JSONSchemaType<CreateAccountIntegration> =
  {
    type: 'object',
    properties: {
      integrationType: {
        type: 'string',
        enum: accountIntegrationValues,
      },
      integrationId: { type: 'string' },
    },
    required: ['integrationType', 'integrationId'],
    additionalProperties: false,
  };

export const validateCreateAccountIntegrationRequestPayload = ajv.compile(
  createAccountIntegrationSchema,
);
