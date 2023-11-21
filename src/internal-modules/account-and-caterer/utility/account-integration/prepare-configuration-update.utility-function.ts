import { AccountSecretReferenceSecretTypeValues } from 'src/external-modules';
import { ISystemIntegration } from '../../interfaces/account-integration.interface';
import * as Sentry from '@sentry/node';
import { validateAccountIntegrationSecretReferenceType } from '../../validators/account-integration-secret-name.validator-function';

export function prepareAccountIntegrationConfigurationUpdate(
  integration: Omit<ISystemIntegration, 'validEventProcesses'>,
  configUpdate: Record<string, any>,
) {
  const nonSensitiveCredentials: Record<string, any> = {};
  const secrets: Array<{
    type: AccountSecretReferenceSecretTypeValues;
    secret: any;
  }> = [];
  // Update only with valid field names
  for (const config of integration.configurationTemplate) {
    if (configUpdate[config.fieldName]) {
      if (config.isSecret) {
        // If isSecret, then fieldName should be of a specified value
        if (!validateAccountIntegrationSecretReferenceType(config.fieldName)) {
          Sentry.withScope((scope) => {
            scope.setExtra(
              'invalidSecretReferenceSecretType',
              config.fieldName,
            );
            Sentry.captureMessage(
              'Invalid secret reference secret type',
              'error',
            );
          });
          continue;
        }

        secrets.push({
          type: config.fieldName,
          secret: configUpdate[config.fieldName],
        });
      } else {
        nonSensitiveCredentials[config.fieldName] =
          configUpdate[config.fieldName];
      }
    }
  }
  return { nonSensitiveCredentials, secrets };
}
