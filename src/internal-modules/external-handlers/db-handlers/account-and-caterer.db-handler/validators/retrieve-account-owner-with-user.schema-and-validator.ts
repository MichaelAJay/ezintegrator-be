import { AccountOwner, User } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../../../utility/singletons';

export type AccountOwnerWithUser = AccountOwner & {
  owner: User;
};

const retrieveAccountOwnerWithUserSchema: JSONSchemaType<AccountOwnerWithUser> =
  {
    type: 'object',
    properties: {
      accountId: { type: 'string' },
      ownerId: { type: 'string' },
      owner: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { anyOf: [{ type: 'string' }, { type: 'null' }] as any },
          hashedPassword: { type: 'string' },
          hashedRt: { anyOf: [{ type: 'string' }, { type: 'null' }] as any },
          salt: { type: 'string' },
          accountId: { type: 'string' },
        },
        required: [],
        additionalProperties: true,
      },
    },
    required: ['accountId', 'ownerId', 'owner'],
    additionalProperties: true,
  };

export const validateRetrievedAccountOwnerWithUser = ajv.compile(
  retrieveAccountOwnerWithUserSchema,
);
