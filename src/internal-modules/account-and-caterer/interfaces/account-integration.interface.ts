import { EventType } from '../../../external-modules/db-client/types/event.type';
import {
  AccountSecretReferenceSecretTypeValues,
  IntegrationActionValues,
} from '../../../external-modules';
import { IAccountIntegrationFieldConfigurationJson } from './account-integration-fields.json-interface';
import { CrmIntegrationActionValues } from 'src/external-modules/db-client/types/crm-integration-action.type';
import { AccountIntegrationType } from '../types';

export interface IAccountIntegration {
  id: string;
  type: AccountIntegrationType;
  accountId: string;
  nonSensitiveCredentials: Record<string, any>;
  isConfigured: boolean;
  isActive: boolean;
  secretRefs: AccountSecretReferenceSecretTypeValues[];
  eventProcesses: IAccountEventProcess[];
  integration: ISystemIntegration;
}

export interface ISystemIntegration {
  name: string; // This could be a union of string literals
  configurationTemplate: IAccountIntegrationFieldConfigurationJson[];
  validEventProcesses: IntegrationActionValues[];
}

export interface IAccountEventProcess {
  event: EventType;
  actions: CrmIntegrationActionValues[]; // This should be a union of all string literal unions of *IntegrationActions from the Prisma schema
}
