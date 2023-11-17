import { Module } from '@nestjs/common';
import { IntegrationUtilityService } from './integration-utility.service';
import { IntegratorsModule } from './integrators/integrators.module';

@Module({
  imports: [IntegratorsModule],
  providers: [IntegrationUtilityService],
  exports: [IntegrationUtilityService],
})
export class IntegrationUtilityModule {}
