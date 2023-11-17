import { BadRequestException, Injectable } from '@nestjs/common';
import { IAccountIntegrationFieldConfigurationJson } from '../account-and-caterer/interfaces/account-integration-fields.json-interface';
import {
  AccountIntegration,
  AccountIntegrationType,
} from '../account-and-caterer/types';
import { IIntegrationUtilityProvider } from './interfaces/class-interfaces/integration-utility-service.class-interface';
import { CrmIntegratorService } from './integrators/integration-classes/crm-integrator.service';

@Injectable()
export class IntegrationUtilityService implements IIntegrationUtilityProvider {
  constructor(private readonly crmIntegratorService: CrmIntegratorService) {}

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
        configurationRequirements =
          await this.crmIntegratorService.retrieveIntegrationConfigurationRequirements(
            integrationId,
          );
        break;
      default:
        throw new BadRequestException(
          'No configuration requirements found for the provided integration type.',
        );
    }
    return configurationRequirements;
  }

  async getIntegrationsOfType(integrationType: AccountIntegrationType) {
    let results;
    switch (integrationType) {
      case 'CRM':
        results = await this.crmIntegratorService.retrieveMany();
        break;
      default:
        throw new BadRequestException(
          'No integrations found for the provided integration type',
        );
    }
    return results;
  }
}
