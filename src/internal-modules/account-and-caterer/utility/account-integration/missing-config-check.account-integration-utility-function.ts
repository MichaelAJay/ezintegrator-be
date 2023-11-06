import { IAccountIntegrationSecret } from '../../interfaces';
import { IAccountIntegrationFieldConfigurationJson } from '../../interfaces/account-integration-fields.json-interface';

export function missingConfigCheck(
  configTemplate: IAccountIntegrationFieldConfigurationJson[],
  secretRefs: IAccountIntegrationSecret[],
  nonSensitiveConfigKeys: string[],
): IAccountIntegrationFieldConfigurationJson[] {
  const missingConfigs: IAccountIntegrationFieldConfigurationJson[] = [];
  for (const config of configTemplate) {
    if (config.isSecret) {
      const matchingSecretReference = secretRefs.find(
        (secretRef) => secretRef.type === config.fieldName,
      );
      if (!matchingSecretReference) {
        missingConfigs.push(config);
      }
    } else {
      if (!nonSensitiveConfigKeys.includes(config.fieldName)) {
        missingConfigs.push(config);
      }
    }
  }
  return missingConfigs;
}
