import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Module } from '@nestjs/common';
import { SecretManagerService } from './secret-manager.service';

@Module({
  providers: [
    {
      provide: 'SecretManagerServiceClient',
      useValue: new SecretManagerServiceClient(),
    },
    SecretManagerService,
  ],
  exports: [SecretManagerService],
})
export class SecretManagerModule {}
