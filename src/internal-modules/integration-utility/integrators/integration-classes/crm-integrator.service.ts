import { Injectable } from '@nestjs/common';
import { CrmIntegrationDbHandlerService } from '../../../../internal-modules/external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.service';
import { getIntegrationConfigurationTemplate } from '../../utility/get-integration-configuration-template.utility-function';
import { IIntegrationService } from '../interfaces';

@Injectable()
export class CrmIntegratorService implements IIntegrationService {
  constructor(
    private readonly crmIntegrationDbHandler: CrmIntegrationDbHandlerService,
  ) {}

  async retrieveOne(integrationId: string) {
    throw new Error('Method not implemented.');
  }
  async retrieveMany() {
    return this.crmIntegrationDbHandler.retrieveCrms();
  }
  async retrieveIntegrationConfigurationRequirements(integrationId: string) {
    const crm = await this.crmIntegrationDbHandler.retrieveCrm(integrationId);
    const configurationRequirements = getIntegrationConfigurationTemplate(
      crm.configurationTemplate,
    );
    return configurationRequirements;
  }
}
