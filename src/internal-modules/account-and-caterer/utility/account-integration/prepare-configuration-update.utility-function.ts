import { AccountSecretReferenceSecretTypeValues } from '../../../../external-modules';
import { ISystemIntegration } from '../../interfaces/account-integration.interface';
import * as Sentry from '@sentry/node';
import { validateAccountIntegrationSecretReferenceType } from '../../validators/account-integration-secret-name.validator-function';

export type PrepareAccountIntegrationConfigurationUpdateReturn = {
  nonSensitiveCredentials: Record<string, any>;
  secrets: Array<{
    type: AccountSecretReferenceSecretTypeValues;
    secret: any;
  }>;
  invalidFields: Array<{ fieldName: string; reason: string }>;
};

export function prepareAccountIntegrationConfigurationUpdate(
  integration: Omit<ISystemIntegration, 'validEventProcesses'>,
  configUpdate: Record<string, any>,
): PrepareAccountIntegrationConfigurationUpdateReturn {
  const nonSensitiveCredentials: Record<string, any> = {};
  const secrets: Array<{
    type: AccountSecretReferenceSecretTypeValues;
    secret: string | Buffer;
  }> = [];
  const invalidFields: Array<{ fieldName: string; reason: string }> = [];
  for (const property in configUpdate) {
    const matchingConfig = integration.configurationTemplate.find(
      (config) => config.fieldName === property,
    );
    if (!matchingConfig) {
      invalidFields.push({
        fieldName: property,
        reason: 'No matching config key',
      });
      continue;
    }

    if (matchingConfig.isSecret) {
      /**
       * @check -- property is in list of allowed field names
       */
      if (!validateAccountIntegrationSecretReferenceType(property)) {
        Sentry.withScope((scope) => {
          scope.setExtra('invalidSecretReferenceSecretType', property);
          Sentry.captureMessage(
            'Invalid secret reference secret type',
            'error',
          );
        });
        invalidFields.push({
          fieldName: property,
          reason: 'Invalid config secret field name',
        });
        continue;
      }
      if (
        !(
          typeof configUpdate[property] === 'string' ||
          Buffer.isBuffer(configUpdate[property])
        )
      ) {
        invalidFields.push({
          fieldName: property,
          reason: 'Secret must be a string or Buffer',
        });
      }
      secrets.push({
        type: property,
        secret: configUpdate[property],
      });
    } else {
      nonSensitiveCredentials[property] = configUpdate[property];
    }
  }

  return { nonSensitiveCredentials, secrets, invalidFields };
}
