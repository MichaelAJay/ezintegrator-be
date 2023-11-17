import * as Sentry from '@sentry/node';
import { ICreateAccountIntegrationReturn } from '../../interfaces';

export function generalizeCreateAccountCrmIntegrationResult(
  result: any,
): ICreateAccountIntegrationReturn {
  try {
    const generalizedResult: ICreateAccountIntegrationReturn = {
      id: result.id,
      type: 'CRM',
      isConfigured: result.isConfigured,
      isActive: result.isActive,
      integration: {
        id: result.crm.id,
        name: result.crm.name,
        configurationTemplate: result.crm.configurationTemplate,
        validEventProcesses: result.crm.validEventProcesses.map(
          (process: any) => process.action,
        ),
      },
    };
    return generalizedResult;
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
}
