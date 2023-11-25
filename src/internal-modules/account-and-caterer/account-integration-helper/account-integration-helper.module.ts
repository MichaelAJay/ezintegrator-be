import { Module } from '@nestjs/common';
import { SecurityUtilityModule } from 'src/internal-modules/security-utility';
import { AccountIntegrationHelperService } from './account-integration-helper.service';
import { AccountIntegrationMapperService } from './account-integration-mapper.service';

@Module({
  imports: [SecurityUtilityModule],
  providers: [AccountIntegrationHelperService, AccountIntegrationMapperService],
  exports: [AccountIntegrationHelperService, AccountIntegrationMapperService],
})
export class AccountIntegrationHelperModule {}
