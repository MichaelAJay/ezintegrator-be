import { IFullAccountIntegration } from '../../account-integration.interface';
import { IGetAccountIntegrationConfigStatusAndMissingValues } from './get-account-integration-config-status-and-missing-values.method-return';

export type GetAccountIntegrationReturn = Omit<
  IFullAccountIntegration,
  'accountId'
> & {
  configStatus: IGetAccountIntegrationConfigStatusAndMissingValues;
};
