import {
  AccountIntegrationType,
  accountIntegrationValues,
} from '../../../internal-modules/account-and-caterer/types';

export function validateIntegrationType(
  integrationType: any,
): integrationType is AccountIntegrationType {
  return accountIntegrationValues.includes(integrationType);
}
