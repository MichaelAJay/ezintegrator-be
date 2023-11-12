import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AccountAndCatererService } from '../../internal-modules/account-and-caterer/account-and-caterer.service';
import { FastifyReply } from 'fastify';
import { getEnvironmentVariable } from '../../utility';
import { createAccountAndUserApiValidator } from './validation/create-account-and-user.post.validator';
import { AuthenticatedRequest } from '../types';
import { addSecretRequestPayloadValidator } from './validation/add-secret.schema-and-validator';
import { IAccountController } from './interfaces';
import { AccountIntegrationService } from '../../internal-modules/account-and-caterer/account-integration.service';
import { validateAddUserRequestBody } from './validation/add-user.schema-and-validator';
import { validateIntegrationType } from './validation/integration.type.validator-function';
import { validateCreateAccountIntegrationRequestPayload } from './validation/create-account-integration.schema-and-validator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateAccountAndUserRequestBody } from '../../internal-modules/account-and-caterer/interfaces';
import { CreateAccountUserRequestBody } from '../swagger/request/body/create-account-user.request-body';
import { SwaggerErrorDescriptions } from '../swagger/descriptions/errors';
import {
  activateAccountIntegration,
  addUserApiOperations,
  createAccountAndUserApiOperation,
  createAccountIntegrationApiOperations,
  deactivateAccountIntegration,
  deleteAccountIntegration,
  getAccountIntegrationsOfTypeApiOperations,
  upsertAccountSecretApiOperations,
} from '../swagger/operations/account';
import {
  AccountIntegration,
  AccountIntegrationType,
} from '../../internal-modules/account-and-caterer/types';

@Controller('account')
export class AccountController implements IAccountController {
  constructor(
    private readonly accountAndCatererService: AccountAndCatererService,
    private readonly accountIntegrationService: AccountIntegrationService,
  ) {}

  /**
   * **************************
   * *** ACCOUNT MANAGEMENT ***
   * **************************
   */
  @Public()
  @ApiOperation(createAccountAndUserApiOperation)
  @ApiBody({ type: CreateAccountAndUserRequestBody })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiConflictResponse({ description: SwaggerErrorDescriptions.NonUniqueEmail })
  @Post()
  async createAccountAndUser(
    @Body() body: unknown,
    @Res() response: FastifyReply,
  ) {
    if (!createAccountAndUserApiValidator(body)) {
      throw new BadRequestException(createAccountAndUserApiValidator.errors);
    }

    const { at, rt } = await this.accountAndCatererService.createAccount(body);

    response.setCookie('access_token', at, {
      httpOnly: true,
      path: '/',
      secure: getEnvironmentVariable('NODE_ENV') === 'production',
    });
    response.setCookie('refresh_token', rt, {
      httpOnly: true,
      path: '/',
      secure: getEnvironmentVariable('NODE_ENV') === 'production',
    });

    response.status(201).send();
  }

  /**
   * **************************************
   * *** ACCOUNT INTEGRATION MANAGEMENT ***
   * **************************************
   */
  @ApiOperation(createAccountIntegrationApiOperations)
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  // @TODO - FK constraint error for accountId
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @Post('integration')
  async createAccountIntegration(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateCreateAccountIntegrationRequestPayload(body)) {
      throw new BadRequestException(
        validateCreateAccountIntegrationRequestPayload.errors,
      );
    }

    const { integrationType, integrationId } = body;
    return this.accountIntegrationService.createAccountIntegration(
      integrationType,
      integrationId,
      req.accountId,
      req.userId,
    );
  }

  @ApiOperation(deactivateAccountIntegration)
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @ApiParam({ name: 'id' })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @ApiNotFoundResponse({ description: SwaggerErrorDescriptions.NotFound })
  @ApiConflictResponse({
    description: SwaggerErrorDescriptions.RecordDoesNotBelongToAccount,
  })
  @Patch('integration/:type/:id/deactivate')
  async deactivateAccountIntegration(
    @Param('type') integrationType: string,
    @Param('id') accountIntegrationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException(
        SwaggerErrorDescriptions.RequestValidationFailed,
      );
    }
    return this.accountIntegrationService.deactivate(
      integrationType,
      accountIntegrationId,
      req.accountId,
      req.userId,
    );
  }

  @ApiOperation(activateAccountIntegration)
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @ApiParam({ name: 'id' })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @ApiNotFoundResponse({ description: SwaggerErrorDescriptions.NotFound })
  @ApiConflictResponse({
    description: SwaggerErrorDescriptions.RecordDoesNotBelongToAccount,
  })
  @Patch('integration/:type/:id/activate')
  async activateAccountIntegration(
    @Param('type') integrationType: string,
    @Param('id') accountIntegrationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException(
        SwaggerErrorDescriptions.RequestValidationFailed,
      );
    }
    return this.accountIntegrationService.activate(
      integrationType,
      accountIntegrationId,
      req.accountId,
      req.userId,
    );
  }

  @ApiOperation(getAccountIntegrationsOfTypeApiOperations)
  @ApiParam({
    name: 'type',
    description: 'Integration type',
    enum: AccountIntegration,
  })
  @ApiOkResponse({
    // @TODO Type response
    description: 'Returns array of account integrations matching the type',
  })
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @Get('integrations/:type')
  async getAccountIntegrationsOfType(
    @Param('type') integrationType: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException(
        'Bad validation type - see the documentation.',
      );
    }
    return this.accountIntegrationService.getAccountIntegrationsOfType(
      integrationType,
      req.accountId,
      req.userId,
    );
  }

  @ApiOperation(deleteAccountIntegration)
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @ApiParam({ name: 'id' })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @ApiNotFoundResponse({ description: SwaggerErrorDescriptions.NotFound })
  @ApiConflictResponse({
    description: SwaggerErrorDescriptions.RecordDoesNotBelongToAccount,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Record is missing accountId or is active',
  })
  @Delete('integration/:type/:id')
  async deleteAccountIntegration(
    @Param('type') integrationType: string,
    @Param('id') accountIntegrationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException(
        'Bad validation type - see the documentation.',
      );
    }
    return this.accountIntegrationService.delete(
      integrationType,
      accountIntegrationId,
      req.accountId,
      req.userId,
    );
  }

  @Get('integration/configuration/:type/:id')
  async getAccountIntegrationConfiguration(
    @Param('type') integrationType: string,
    @Param('id') accountIntegrationId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!validateIntegrationType(integrationType)) {
      throw new BadRequestException(
        'Bad validation type - see the documentation.',
      );
    }
    return this.accountIntegrationService.getAccountIntegrationConfiguration(
      integrationType,
      accountIntegrationId,
      req.accountId,
      req.userId,
    );
  }

  @Get('integrations/configurations')
  async getAccountIntegrationConfigurations(
    @Req() req: AuthenticatedRequest,
    @Query('type') integrationType?: string,
  ) {
    if (integrationType) {
      if (!validateIntegrationType(integrationType)) {
        throw new BadRequestException(
          'Bad validation type - see the documentation.',
        );
      }
      // Forces type safety if integrationType is included
      return this.accountIntegrationService.getAccountIntegrationConfigurations(
        req.userId,
        req.accountId,
        integrationType,
      );
    } else {
      return this.accountIntegrationService.getAccountIntegrationConfigurations(
        req.userId,
        req.accountId,
      );
    }
  }

  /**
   * *************************************************************
   * *** ACCOUNT INTEGRATION CONFIGURATION & SECRET MANAGEMENT ***
   * *************************************************************
   */
  @ApiParam({ name: 'type', enum: AccountIntegration })
  @ApiParam({
    name: 'id',
    description: 'The id of the account integration to update',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @Patch('integration/:type/:id/config')
  async upsertAccountIntegrationConfigValues(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
    @Res() res: FastifyReply,
  ) {
    // The config should actually be specific to a very specific integration - for instance Nutshell CRM
    //
    // NOTE:  The validation of this function must occur at the service level, because it depends on the integration
  }

  @ApiOperation(upsertAccountSecretApiOperations)
  @Patch('integration/:id/secret')
  async upsertAccountSecret(
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
    @Res() res: FastifyReply,
  ) {
    if (!addSecretRequestPayloadValidator(body)) {
      throw new BadRequestException(addSecretRequestPayloadValidator.errors);
    }

    // @TODO
    res.status(200).send();
  }

  /**
   * *******************************
   * *** ACCOUNT USER MANAGEMENT ***
   * *******************************
   */
  @ApiOperation(addUserApiOperations)
  @ApiBody({ type: CreateAccountUserRequestBody })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.RequesterLacksPermission,
  })
  @ApiConflictResponse({ description: SwaggerErrorDescriptions.NonUniqueEmail })
  @Post('user')
  async addUser(@Body() body: any, @Req() req: AuthenticatedRequest) {
    if (!validateAddUserRequestBody(body)) {
      throw new BadRequestException(validateAddUserRequestBody.errors);
    }

    return this.accountAndCatererService.addUser(
      body,
      req.userId,
      req.accountId,
    );
  }
}

// If I'm going to use one method to create a secret, what does it need to include
/**
 * 1) The payload itself.  This is the string method
 * 2) The Integration type - e.g. the "Crm" in "AccountCrmSecretReference"
 * 3) The secret type - e.g. "Api-key"
 * 4) The target - e.g. for integrationType = "CRM", targetId should be an AccountCrm.id
 */
