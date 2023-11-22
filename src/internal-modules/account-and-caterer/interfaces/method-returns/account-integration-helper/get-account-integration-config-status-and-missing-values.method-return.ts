import { IAccountIntegrationFieldConfigurationJson } from '../..';

export type IGetAccountIntegrationConfigStatusAndMissingValues = {
  isFullyConfigured: boolean;
  missingConfigs?: Array<IAccountIntegrationFieldConfigurationJson>;
};
