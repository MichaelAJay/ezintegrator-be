import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountApiModule } from './api/account/account.module';
import { AuthApiModule } from './api/auth/auth.module';
import { AuthGuard } from './api/guards/auth/auth.guard';
import { GuardService } from './api/guards/guard/guard.service';
import { SecurityUtilityModule } from './internal-modules/security-utility';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    ConfigModule.forRoot(),
    AccountApiModule,
    AuthApiModule,
    SecurityUtilityModule,
  ],
  controllers: [],
  providers: [
    GuardService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
