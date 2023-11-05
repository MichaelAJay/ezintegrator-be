import { Module } from '@nestjs/common';
import { AccountAndCatererModule } from 'src/internal-modules/account-and-caterer/account-and-caterer.module';
import { IntegrationController } from './integration.controller';

@Module({
  imports: [AccountAndCatererModule],
  controllers: [IntegrationController],
})
export class IntegrationApiModule {}
