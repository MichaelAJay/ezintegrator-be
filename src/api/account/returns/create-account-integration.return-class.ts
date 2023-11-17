import { ApiProperty } from '@nestjs/swagger';
import {
  AccountIntegration,
  AccountIntegrationType,
} from 'src/internal-modules/account-and-caterer/types';
import { ICreateAccountIntegrationReturn } from '../../../internal-modules/account-and-caterer/interfaces';
import { TargetIntegration } from './common/target-integration.class';

export class CreateAccountIntegrationReturn
  implements ICreateAccountIntegrationReturn
{
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: AccountIntegration })
  type: AccountIntegrationType;

  @ApiProperty({ type: Boolean })
  isConfigured: boolean;

  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @ApiProperty({ type: TargetIntegration })
  integration: TargetIntegration;
}
