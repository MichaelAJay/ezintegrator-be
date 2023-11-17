import { CreateAccountIntegration } from '../../../account/validation/create-account-integration.schema-and-validator';
import {
  AccountIntegration,
  AccountIntegrationType,
} from '../../../../internal-modules/account-and-caterer/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountInterfaceRequestBody
  implements CreateAccountIntegration
{
  @ApiProperty({ enum: AccountIntegration })
  integrationType: AccountIntegrationType;

  @ApiProperty({ type: String })
  integrationId: string;
}
