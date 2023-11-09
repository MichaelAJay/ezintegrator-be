import { Role, RolePermission, User, UserAccountRole } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import { ajv } from '../../../utility/singletons';

export type UserWithPermissions = Pick<User, 'accountId'> & {
  accountRole: Pick<UserAccountRole, 'roleName'> & {
    role: Pick<Role, 'name'> & {
      permissions: Pick<RolePermission, 'permission'>[];
    };
  };
};

const userWithPermissionsSchema: JSONSchemaType<UserWithPermissions> = {
  type: 'object',
  properties: {
    accountId: { type: 'string' },
    accountRole: {
      type: 'object',
      properties: {
        roleName: { type: 'string' },
        role: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  permission: {
                    type: 'string',
                    // @TODO add enum
                  },
                },
                required: ['permission'],
              },
            },
          },
          required: ['permissions'],
          additionalProperties: true,
        },
      },
      required: ['role'],
      additionalProperties: true,
    },
  },
  required: ['accountId', 'accountRole'],
};
export const validateUserWithPermissions = ajv.compile(
  userWithPermissionsSchema,
);
