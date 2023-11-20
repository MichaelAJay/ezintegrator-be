import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AccountSecretReferenceSecretTypeValues,
  crmIntegrationActions,
  IntegrationActionValues,
} from '../../../external-modules';
import {
  IAccountIntegration,
  ISystemIntegration,
  IAccountEventProcess,
  IAccountIntegrationWithConfigAndSystemIntegration,
  IAccountIntegrationWithEventProcessesAndSystemIntegration,
  IFullAccountIntegration,
} from '../interfaces/account-integration.interface';
import { AccountIntegrationFieldName, AccountIntegrationType } from '../types';
import { generateEventProcessesArray } from '../utility/account-integration/generate-event-processes-array.utility-function';
import { IAccountIntegrationMapperService } from './account-integration-mapper-service.class-interface';
import * as Sentry from '@sentry/node';

@Injectable()
export class AccountIntegrationMapperService
  implements IAccountIntegrationMapperService
{
  mapAccountIntegrationToBaseGeneralizedIntegration(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegration {
    try {
      return {
        id: accountIntegration.id,
        type,
        accountId: accountIntegration.accountId,
        nonSensitiveCredentials: accountIntegration.nonSensitiveCredentials,
        isConfigured: accountIntegration.isConfigured,
        isActive: accountIntegration.isActive,
      };
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }
  mapAccountIntegrationToFullGeneralizedIntegration(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IFullAccountIntegration {
    try {
      const baseIntegration =
        this.mapAccountIntegrationToBaseGeneralizedIntegration(
          accountIntegration,
          type,
        );

      const secretRefs =
        this.mapSecretRefsForGeneralizedIntegration(accountIntegration);

      const eventProcesses =
        this.mapAccountIntegrationEventProcesses(accountIntegration);

      let systemIntegrationFieldName: AccountIntegrationFieldName;
      switch (type) {
        case 'CRM':
          systemIntegrationFieldName = 'crm';
          break;
        default:
          throw new InternalServerErrorException(
            'Invalid account integration type',
          );
      }

      const integration = this.mapSystemIntegrationForGeneralizedIntegration(
        accountIntegration,
        systemIntegrationFieldName,
      );

      return {
        ...baseIntegration,
        secretRefs,
        eventProcesses,
        integration,
      };
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }
  mapSystemIntegrationForGeneralizedIntegration(
    accountIntegration: any,
    systemIntegrationFieldName: AccountIntegrationFieldName,
  ): ISystemIntegration {
    try {
      const systemIntegration = accountIntegration[systemIntegrationFieldName];
      if (!systemIntegration) {
        throw new InternalServerErrorException(
          'Invalid system integration field name',
        );
      }

      const validEventProcesses: Array<IntegrationActionValues> = [];
      for (const eventProcess of systemIntegration.validEventProcesses) {
        if (!eventProcess.action) {
          throw new InternalServerErrorException(
            'Event process missing action attribute',
          );
        }
        if (!crmIntegrationActions.includes(eventProcess.action)) {
          throw new InternalServerErrorException(
            'Invalid event process action',
          );
        }
        validEventProcesses.push(eventProcess.action);
      }

      return {
        name: systemIntegration.name,
        configurationTemplate: systemIntegration.configurationTemplate,
        validEventProcesses,
      };
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setExtra(
          'systemIntegrationFieldName',
          systemIntegrationFieldName,
        );
        Sentry.captureException(err);
      });
      throw err;
    }
  }
  mapAccountIntegrationEventProcesses(
    accountIntegration: any,
  ): Array<IAccountEventProcess> {
    return generateEventProcessesArray(accountIntegration.eventProcesses);
  }
  mapSecretRefsForGeneralizedIntegration(
    accountIntegration: any,
  ): Array<AccountSecretReferenceSecretTypeValues> {
    return accountIntegration.secretRefs.map(
      (secretRef: any) => secretRef.type,
    );
  }
  mapAccountIntegrationForConfig(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegrationWithConfigAndSystemIntegration {
    try {
      const baseIntegration =
        this.mapAccountIntegrationToBaseGeneralizedIntegration(
          accountIntegration,
          type,
        );

      const secretRefs =
        this.mapSecretRefsForGeneralizedIntegration(accountIntegration);

      let systemIntegrationFieldName: AccountIntegrationFieldName;
      switch (type) {
        case 'CRM':
          systemIntegrationFieldName = 'crm';
          break;
        default:
          throw new InternalServerErrorException(
            'Invalid account integration type',
          );
      }

      const integration = this.mapSystemIntegrationForGeneralizedIntegration(
        accountIntegration,
        systemIntegrationFieldName,
      );

      return {
        ...baseIntegration,
        secretRefs,
        integration,
      };
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }
  mapAccountIntegrationForEventProcessing(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegrationWithEventProcessesAndSystemIntegration {
    try {
      const baseIntegration =
        this.mapAccountIntegrationToBaseGeneralizedIntegration(
          accountIntegration,
          type,
        );

      const eventProcesses =
        this.mapAccountIntegrationEventProcesses(accountIntegration);

      let systemIntegrationFieldName: AccountIntegrationFieldName;
      switch (type) {
        case 'CRM':
          systemIntegrationFieldName = 'crm';
          break;
        default:
          throw new InternalServerErrorException(
            'Invalid account integration type',
          );
      }

      const integration = this.mapSystemIntegrationForGeneralizedIntegration(
        accountIntegration,
        systemIntegrationFieldName,
      );

      return {
        ...baseIntegration,
        eventProcesses,
        integration,
      };
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }
}
