import { ApiProperty } from '@nestjs/swagger';
import { IntegrationActionValues } from '../../../../external-modules';
import { IAccountIntegrationFieldConfigurationJson } from '../../../../internal-modules/account-and-caterer/interfaces';
import { AccountIntegrationFieldConfigurationJson } from './account-integration-field-configuration-json.class';

export class TargetIntegration {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: () => [AccountIntegrationFieldConfigurationJson] })
  configurationTemplate: IAccountIntegrationFieldConfigurationJson[];

  @ApiProperty({ type: Array<IntegrationActionValues> })
  validEventProcesses: IntegrationActionValues[];
}
