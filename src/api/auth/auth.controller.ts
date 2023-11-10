import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from '../../internal-modules/auth/auth.service';
import { getEnvironmentVariable } from '../../utility';
import { FastifyReply } from 'fastify';
import { validateLoginRequestPayload } from './validation/login.validator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { loginApiOperationOptions } from '../swagger/operations/auth';
import { SwaggerErrorDescriptions } from '../swagger/descriptions/errors';
import { LoginRequestBody } from '../swagger/request/body/login.request-body';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation(loginApiOperationOptions)
  @ApiBadRequestResponse({
    description: SwaggerErrorDescriptions.RequestValidationFailed,
  })
  @ApiUnauthorizedResponse({
    description: SwaggerErrorDescriptions.UnauthorizedLogin,
  })
  @ApiBody({ type: LoginRequestBody })
  @Public()
  @Post('login')
  async login(@Body() body: unknown, @Res() response: FastifyReply) {
    if (!validateLoginRequestPayload(body)) {
      const err = new BadRequestException(validateLoginRequestPayload.errors);
      throw err;
    }

    const { at, rt } = await this.authService.authenticate(body);

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
}
