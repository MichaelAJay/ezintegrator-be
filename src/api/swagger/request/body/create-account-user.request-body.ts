import { ApiProperty } from '@nestjs/swagger';
import { CreateAccountUserRequestPayload } from '../../../../api/account/validation/add-user.schema-and-validator';

export class CreateAccountUserRequestBody
  implements CreateAccountUserRequestPayload
{
  @ApiProperty({ type: String, description: 'Unique email' })
  email: string;
  @ApiProperty({ type: String })
  firstName: string;
  @ApiProperty({ type: String, required: false })
  lastName?: string | null | undefined;
}
