import { Module } from '@nestjs/common';
import { IntegrationUtilityModule } from '../../internal-modules/integration-utility/integration-utility.module';
import { IntegrationController } from './integration.controller';

@Module({
  imports: [IntegrationUtilityModule],
  controllers: [IntegrationController],
})
export class IntegrationApiModule {}
