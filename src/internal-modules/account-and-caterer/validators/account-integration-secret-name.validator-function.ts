import {
  accountSecretReferenceSecretTypes,
  AccountSecretReferenceSecretTypeValues,
} from 'src/external-modules';

export function validateAccountIntegrationSecretReferenceType(
  fieldName: any,
): fieldName is AccountSecretReferenceSecretTypeValues {
  return accountSecretReferenceSecretTypes.includes(fieldName);
}
