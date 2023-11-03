import { Injectable } from '@nestjs/common';
import { IGuardServiceProvider } from './guard-service.class-interface';

@Injectable()
export class GuardService implements IGuardServiceProvider {
  getCookie(name: string): string {
    console.log(name);
    return name;
  }
}
