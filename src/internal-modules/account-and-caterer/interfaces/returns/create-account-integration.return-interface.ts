import { IntegrationActionValues } from 'src/external-modules';
import { AccountIntegrationType } from '../../types';
import { IAccountIntegrationFieldConfigurationJson } from '../account-integration-fields.json-interface';

export interface ICreateAccountIntegrationReturn {
  id: string;
  type: AccountIntegrationType;
  isConfigured: boolean;
  isActive: boolean;
  integration: {
    id: string;
    name: string;
    configurationTemplate: IAccountIntegrationFieldConfigurationJson[];
    validEventProcesses: IntegrationActionValues[];
  };
}
