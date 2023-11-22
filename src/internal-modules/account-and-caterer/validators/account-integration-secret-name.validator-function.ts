import {
  accountSecretReferenceSecretTypes,
  AccountSecretReferenceSecretTypeValues,
} from '../../../external-modules';

export function validateAccountIntegrationSecretReferenceType(
  fieldName: any,
): fieldName is AccountSecretReferenceSecretTypeValues {
  return accountSecretReferenceSecretTypes.includes(fieldName);
}
