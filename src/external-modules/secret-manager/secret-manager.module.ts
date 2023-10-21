import { Module } from '@nestjs/common';
import { SecretManagerService } from './secret-manager.service';

@Module({
  providers: [SecretManagerService]
})
export class SecretManagerModule {}
