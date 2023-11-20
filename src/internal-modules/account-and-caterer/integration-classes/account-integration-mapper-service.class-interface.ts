import { AccountSecretReferenceSecretTypeValues } from 'src/external-modules';
import {
  IAccountEventProcess,
  IAccountIntegration,
  IAccountIntegrationWithConfigAndSystemIntegration,
  IAccountIntegrationWithEventProcessesAndSystemIntegration,
  IFullAccountIntegration,
  ISystemIntegration,
} from '../interfaces/account-integration.interface';
import { AccountIntegrationType } from '../types';

export interface IAccountIntegrationMapperService {
  mapAccountIntegrationToBaseGeneralizedIntegration(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegration;
  mapAccountIntegrationToFullGeneralizedIntegration(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IFullAccountIntegration;
  /**
   * @important This is the only class method that requires the specific system integration instead of the entire account integration (e.g. crm from accountCrm)
   */
  mapSystemIntegrationForGeneralizedIntegration(
    systemIntegration: any,
    systemIntegrationFieldName: 'crm',
  ): ISystemIntegration;
  mapAccountIntegrationEventProcesses(
    accountIntegration: any,
  ): Array<IAccountEventProcess>;
  mapSecretRefsForGeneralizedIntegration(
    accountIntegration: any,
  ): Array<AccountSecretReferenceSecretTypeValues>;
  mapAccountIntegrationForConfig(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegrationWithConfigAndSystemIntegration;
  mapAccountIntegrationForEventProcessing(
    accountIntegration: any,
    type: AccountIntegrationType,
  ): IAccountIntegrationWithEventProcessesAndSystemIntegration;
}
