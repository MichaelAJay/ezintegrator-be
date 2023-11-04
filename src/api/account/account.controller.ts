import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AccountAndCatererService } from 'src/internal-modules/account-and-caterer/account-and-caterer.service';
import { FastifyReply } from 'fastify';
import { getEnvironmentVariable } from 'src/utility';
import { createAccountAndUserApiValidator } from './validation/create-account-and-user.post.validator';
import { AuthenticatedRequest } from '../types';
import { upsertAccountSecretApiValidator } from './validation/upsert-secret.validator';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountAndCatererService: AccountAndCatererService,
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

  @Patch('secret')
  async upsertAccountSecret(
    @Body() body: any,
    @Req() req: AuthenticatedRequest,
    @Res() res: FastifyReply,
  ) {
    if (!upsertAccountSecretApiValidator(body)) {
      throw new BadRequestException(createAccountAndUserApiValidator.errors);
    }
    await this.accountAndCatererService.upsertSecret(
      req.userId,
      body.name,
      body.value,
    );
    res.status(200).send();
  }
}
