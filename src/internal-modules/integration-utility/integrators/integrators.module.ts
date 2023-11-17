import { Module } from '@nestjs/common';
import { CrmIntegrationDbHandlerModule } from '../../../internal-modules/external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.module';
import { CrmIntegratorService } from './integration-classes/crm-integrator.service';

@Module({
  imports: [CrmIntegrationDbHandlerModule],
  providers: [CrmIntegratorService],
  exports: [CrmIntegratorService],
})
export class IntegratorsModule {}
