import { IAccountEventProcess } from '../../interfaces/account-integration.interface';
import * as Sentry from '@sentry/node';
import { InternalServerErrorException } from '@nestjs/common';
import { CrmIntegrationActionValues } from '../../../../external-modules/db-client/types/crm-integration-action.type';
import { EventType } from 'src/external-modules/db-client/types/event.type';

export function generateEventProcessesArray(
  eventProcessesInput: any[],
): Array<IAccountEventProcess> {
  try {
    const eventProcessesHashMap: Record<string, CrmIntegrationActionValues[]> =
      {};
    for (const eventProcess of eventProcessesInput) {
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
    return eventProcesses;
  } catch (err) {
    Sentry.captureException(err);
    throw new InternalServerErrorException();
  }
}
