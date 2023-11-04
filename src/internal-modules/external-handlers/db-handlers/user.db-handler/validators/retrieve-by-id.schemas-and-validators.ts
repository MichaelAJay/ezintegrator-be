import { AccountOwner, User } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import { ajv } from 'src/utility/singletons';

export type SafeUserByIdWithAccountOwner = Omit<
  User,
  'hashedPassword' | 'hashedRt' | 'salt'
> & {
  ownedAccounts: AccountOwner[];
};
const retrieveSafeUserByIdWithAccountOwnerSchema: JSONSchemaType<SafeUserByIdWithAccountOwner> =
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: {
        anyOf: [{ type: 'string' }, { type: 'null' }] as any,
      },
      accountId: { type: 'string' },
      ownedAccounts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            accountId: { type: 'string' },
            ownerId: { type: 'string' },
          },
          required: ['accountId', 'ownerId'],
          additionalProperties: false,
        },
      },
    },
    required: ['id', 'email', 'firstName', 'accountId', 'ownedAccounts'],
    additionalProperties: true,
  };

const retrieveSafeUserByIdWithAccountOwnerValidationFunction = ajv.compile(
  retrieveSafeUserByIdWithAccountOwnerSchema,
);

export function retrieveSafeUserByIdWithAccountOwnerValidator(
  data: unknown,
): data is SafeUserByIdWithAccountOwner {
  const isValid = retrieveSafeUserByIdWithAccountOwnerValidationFunction(data);
  return isValid;
}
