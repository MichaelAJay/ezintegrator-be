export interface IIntegrationService {
  retrieveOne(integrationId: string): any;
  retrieveMany(): any;
  retrieveIntegrationConfigurationRequirements(integrationId: string): any;
}
