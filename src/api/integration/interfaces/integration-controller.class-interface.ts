export interface IIntegrationController {
  getIntegrationConfigurationTemplate(
    integrationType: unknown,
    integrationId: string,
  ): any;
  getIntegrationsOfType(integrationType: unknown): any;
}
