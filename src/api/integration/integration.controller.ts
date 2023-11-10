import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AccountIntegration } from 'src/internal-modules/account-and-caterer/types';
import { IntegrationUtilityService } from '../../internal-modules/integration-utility/integration-utility.service';
import { SwaggerErrorDescriptions } from '../swagger/descriptions/errors';
import {
  getIntegrationConfigurationTemplate,
  getIntegrationsOfType,
  getIntegrationTypesApiOperationOptions,
} from '../swagger/operations/integrations';
import { IIntegrationController } from './interfaces';
import { validateIntegrationType } from './validators/integration-type.validator';

@Controller('integration')
export class IntegrationController implements IIntegrationController {
  constructor(
    private readonly integrationUtilityService: IntegrationUtilityService,
  ) {}

  @ApiOperation(getIntegrationTypesApiOperationOptions)
  @Get('types')
  @ApiOkResponse()
  async getIntegrationTypes() {
    return this.integrationUtilityService.getIntegrationTypes();
  }

  @ApiOperation(getIntegrationConfigurationTemplate)
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Configuration template failed validation',
  })
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @Get(':type/configuration-template')
  async getIntegrationConfigurationTemplate(
    @Param('type') integrationType: unknown,
    @Query('id') integrationId: string | undefined,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException('Invalid integration type');
    }
    if (!integrationId) {
      throw new BadRequestException('Missing integration id query param');
    }
    return this.integrationUtilityService.getIntegrationConfigurationRequirements(
      integrationType,
      integrationId,
    );
  }

  @ApiOperation(getIntegrationsOfType)
  @ApiOkResponse()
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @Get('type/:type')
  async getIntegrationsOfType(@Param('type') integrationType: unknown) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException('Invalid integration type');
    }
    return this.integrationUtilityService.getIntegrationsOfType(
      integrationType,
    );
  }
}
