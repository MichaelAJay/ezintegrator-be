import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtHandlerService } from '../../../internal-modules/security-utility/jwt-handler.service';

import { GuardService } from '../guard/guard.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly guardService: GuardService,
    private readonly jwtHandler: JwtHandlerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const token = this.guardService.getCookie(req, 'access_token');
      const payload = await this.jwtHandler.verifyWithSecret(token);

      req.userId = payload.sub;
      req.accountId = payload.acct;

      return true;
    } catch (err) {
      return false;
    }
  }
}
