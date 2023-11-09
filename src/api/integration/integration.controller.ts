import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { IntegrationUtilityService } from '../../internal-modules/integration-utility/integration-utility.service';
import { IIntegrationController } from './interfaces';
import { validateIntegrationType } from './validators/integration-type.validator';

@Controller('integration')
export class IntegrationController implements IIntegrationController {
  constructor(
    private readonly integrationUtilityService: IntegrationUtilityService,
  ) {}

  @Get('types')
  async getIntegrationTypes() {
    return this.integrationUtilityService.getIntegrationTypes();
  }

  @Get(':type/:id/configuration-template')
  async getIntegrationConfigurationTemplate(
    @Param('type') integrationType: unknown,
    @Param('id') integrationId: string,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException('Invalid integrationType');
    }
    return this.integrationUtilityService.getIntegrationConfigurationRequirements(
      integrationType,
      integrationId,
    );
  }

  @Get(':type')
  async getIntegrationsOfType(@Param('type') integrationType: unknown) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException('Invalid integrationType');
    }
    return this.integrationUtilityService.getIntegrationsOfType(
      integrationType,
    );
  }
}
