import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccountApiModule } from './api/account/account.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    ConfigModule.forRoot(),
    AccountApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
