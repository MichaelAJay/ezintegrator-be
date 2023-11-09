import { AccountSecretReferenceSecretType } from '@prisma/client';

export const accountSecretReferenceType = AccountSecretReferenceSecretType;
export type AccountSecretReferenceTypeValues =
  (typeof accountSecretReferenceType)[keyof typeof accountSecretReferenceType];

export const accountSecretReferenceTypeValues = Object.values(
  accountSecretReferenceType,
) as Array<
  (typeof accountSecretReferenceType)[keyof typeof accountSecretReferenceType]
>;
