import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
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

@Controller('account')
export class AccountController implements IAccountController {
  constructor(
    private readonly accountAndCatererService: AccountAndCatererService,
    private readonly accountIntegrationService: AccountIntegrationService,
  ) {}

  @Public()
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

  @Post('integration')
  // Need to change that any to an unknown and validate
  async createAccountIntegration(@Body() body: any) {
    const { integrationType, integrationId } = body;
    return this.accountIntegrationService.createAccountIntegration(
      integrationType,
      integrationId,
      'add account id',
    );
  }

  @Patch('secret')
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

  // USER MANAGEMENT
  @Post('user')
  async addUser(@Body() body: any, @Req() req: AuthenticatedRequest) {
    if (!validateAddUserRequestBody(body)) {
      throw new BadRequestException(validateAddUserRequestBody.errors);
    }

    return this.accountAndCatererService.addUser(
      body.email,
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
