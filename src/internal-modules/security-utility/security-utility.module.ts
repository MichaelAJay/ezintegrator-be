import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptoUtilityService } from './crypto-utility.service';
import { JwtHandlerService } from './jwt-handler.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [CryptoUtilityService, JwtHandlerService],
  exports: [CryptoUtilityService, JwtHandlerService],
})
export class SecurityUtilityModule {}
