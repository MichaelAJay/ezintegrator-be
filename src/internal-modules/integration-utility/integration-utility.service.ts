import { BadRequestException, Injectable } from '@nestjs/common';
import { IAccountIntegrationFieldConfigurationJson } from '../account-and-caterer/interfaces/account-integration-fields.json-interface';
import {
  AccountIntegration,
  AccountIntegrationType,
} from '../account-and-caterer/types';
import { getIntegrationConfigurationTemplate } from './utility/get-integration-configuration-template.utility-function';
import { CrmIntegrationDbHandlerService } from '../external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.service';
import { IIntegrationUtilityProvider } from './interfaces/class-interfaces/integration-utility-service.class-interface';

@Injectable()
export class IntegrationUtilityService implements IIntegrationUtilityProvider {
  constructor(
    private readonly crmIntegrationDbHandler: CrmIntegrationDbHandlerService,
  ) {}

  getIntegrationTypes() {
    return AccountIntegration;
  }

  async getIntegrationConfigurationRequirements(
    integrationType: AccountIntegrationType,
    integrationId: string,
  ): Promise<IAccountIntegrationFieldConfigurationJson[]> {
    let configurationRequirements: IAccountIntegrationFieldConfigurationJson[] =
      [];
    switch (integrationType) {
      case 'CRM':
        const crm = await this.crmIntegrationDbHandler.retrieveCrm(
          integrationId,
        );
        configurationRequirements = getIntegrationConfigurationTemplate(
          crm.configurationTemplate,
        );
        break;
      default:
        throw new BadRequestException(
          'No configuration requirements found for the provided integration type.',
        );
    }
    return configurationRequirements;
  }

  /**
   * @TODO this should also return each integration's possible event processes
   */
  async getIntegrationsOfType(integrationType: AccountIntegrationType) {
    let results;
    switch (integrationType) {
      case 'CRM':
        results = await this.crmIntegrationDbHandler.retrieveCrms();
        break;
      default:
        throw new BadRequestException(
          'No integrations found for the provided integration type',
        );
    }
    return results;
  }
}
