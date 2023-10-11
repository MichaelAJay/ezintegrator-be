import { Module } from '@nestjs/common';
import { DbClientService } from './db-client.service';

@Module({
  providers: [DbClientService]
})
export class DbClientModule {}
