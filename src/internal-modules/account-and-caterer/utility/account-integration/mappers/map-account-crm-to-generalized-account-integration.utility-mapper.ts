import {
  IAccountEventProcess,
  IAccountIntegration,
} from '../../../interfaces/account-integration.interface';
import * as Sentry from '@sentry/node';
import { CrmIntegrationActionValues } from '../../../../../external-modules/db-client/types/crm-integration-action.type';
import { EventType } from 'src/external-modules/db-client/types/event.type';

export function mapAccountCrmToGeneralizedAccountIntegration(
  accountCrm: any,
): IAccountIntegration {
  try {
    const eventProcessesHashMap: Record<string, CrmIntegrationActionValues[]> =
      {};
    for (const eventProcess of accountCrm.eventProcesses) {
      if (eventProcessesHashMap.hasOwnProperty(eventProcess.event)) {
        eventProcessesHashMap[eventProcess.event].push(eventProcess.action);
      } else {
        eventProcessesHashMap[eventProcess.event] = [eventProcess.action];
      }
    }

    const eventProcesses: IAccountEventProcess[] = [];
    for (const property in eventProcessesHashMap) {
      eventProcesses.push({
        event: property as EventType,
        actions: eventProcessesHashMap[property],
      });
    }

    const ret: IAccountIntegration = {
      id: accountCrm.id,
      accountId: accountCrm.accountId,
      nonSensitiveCredentials: accountCrm.nonSensitiveCredentials,
      isConfigured: accountCrm.isConfigured,
      isActive: accountCrm.isActive,
      secretRefs: accountCrm.secretRefs.map((secretRef: any) => secretRef.type),
      eventProcesses,
      integration: {
        configurationTemplate: accountCrm.crm.configurationTemplate,
        validEventProcesses: accountCrm.crm.validEventProcesses.map(
          (eventProcess: any) => eventProcess.action,
        ),
      },
    };
    return ret;
  } catch (err) {
    // Sentry.captureException(err);
    console.error(err);
    throw err;
  }
}
