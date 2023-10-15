import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtHandler } from '.';

@Injectable()
export class JwtHandlerService implements IJwtHandler {
  constructor(private readonly jwtService: JwtService) {}
}
