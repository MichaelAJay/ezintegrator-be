import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { IntegrationUtilityService } from 'src/internal-modules/integration-utility/integration-utility.service';
import { IIntegrationController } from './interfaces';
import { validateIntegrationType } from './validators/integration-type.validator';

@Controller('integration')
export class IntegrationController implements IIntegrationController {
  constructor(
    private readonly integrationUtilityService: IntegrationUtilityService,
  ) {}

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
}
