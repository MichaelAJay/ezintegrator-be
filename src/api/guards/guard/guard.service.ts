import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IGuardServiceProvider } from './guard-service.class-interface';

@Injectable()
export class GuardService implements IGuardServiceProvider {
  getCookie(req: any, name: string): string {
    const value = req.cookies[name];
    if (!value || typeof value !== 'string') {
      throw new UnauthorizedException('Missing cookie or invalid cookie type');
    }

    return value;
  }
}
