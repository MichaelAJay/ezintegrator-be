import { ApiProperty } from '@nestjs/swagger';
import { IAccountIntegrationFieldConfigurationJson } from '../../../../internal-modules/account-and-caterer/interfaces';

export class AccountIntegrationFieldConfigurationJson
  implements IAccountIntegrationFieldConfigurationJson
{
  @ApiProperty({ type: String })
  fieldName: string;
  @ApiProperty({ type: String })
  description: string;
  @ApiProperty({ type: Boolean })
  isSecret: boolean;
}
