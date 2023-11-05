import { Module } from '@nestjs/common';
import { DbClientModule } from 'src/external-modules';
import { CrmIntegrationDbHandlerService } from './crm-integration.db-handler.service';
import { CrmIntegrationDbQueryBuilderService } from './crm-integration.db-query-builder.service';

@Module({
  imports: [DbClientModule],
  providers: [
    CrmIntegrationDbHandlerService,
    CrmIntegrationDbQueryBuilderService,
  ],
  exports: [CrmIntegrationDbHandlerService],
})
export class CrmIntegrationDbHandlerModule {}
