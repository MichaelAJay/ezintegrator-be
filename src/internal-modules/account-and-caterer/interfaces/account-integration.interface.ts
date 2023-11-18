import { EventType } from '../../../external-modules/db-client/types/event.type';
import {
  AccountSecretReferenceSecretTypeValues,
  IntegrationActionValues,
} from '../../../external-modules';
import { IAccountIntegrationFieldConfigurationJson } from './account-integration-fields.json-interface';
import { CrmIntegrationActionValues } from 'src/external-modules/db-client/types/crm-integration-action.type';

export interface IAccountIntegration {
  id: string;
  accountId: string;
  nonSensitiveCredentials: Record<string, any>;
  isConfigured: boolean;
  isActive: boolean;
  secretRefs: AccountSecretReferenceSecretTypeValues[];
  eventProcesses: IAccountEventProcess[];
  integration: ISystemIntegration;
}

export interface ISystemIntegration {
  configurationTemplate: IAccountIntegrationFieldConfigurationJson[];
  validEventProcesses: IntegrationActionValues[];
}

export interface IAccountEventProcess {
  event: EventType;
  actions: CrmIntegrationActionValues; // This should be a union of all string literal unions of *IntegrationActions from the Prisma schema
}
