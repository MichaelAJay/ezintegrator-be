import { Module } from '@nestjs/common';
import { CrmIntegrationDbHandlerModule } from '../external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.module';
import { IntegrationUtilityService } from './integration-utility.service';

@Module({
  imports: [CrmIntegrationDbHandlerModule],
  providers: [IntegrationUtilityService],
  exports: [IntegrationUtilityService],
})
export class IntegrationUtilityModule {}
