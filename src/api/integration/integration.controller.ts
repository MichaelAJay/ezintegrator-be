import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { AccountAndCatererService } from 'src/internal-modules/account-and-caterer/account-and-caterer.service';
import { IIntegrationController } from './interfaces';
import { validateIntegrationType } from './validators/integration-type.validator';

@Controller('integration')
export class IntegrationController implements IIntegrationController {
  constructor(
    private readonly accountAndCatererService: AccountAndCatererService,
  ) {}

  @Get(':type/:id/configuration-template')
  async getIntegrationConfigurationTemplate(
    @Param('type') integrationType: unknown,
    @Param('id') integrationId: string,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException('Invalid integrationType');
    }
    return this.accountAndCatererService.getAccountIntegrationConfigurationRequirements(
      integrationType,
      integrationId,
    );
  }
}
