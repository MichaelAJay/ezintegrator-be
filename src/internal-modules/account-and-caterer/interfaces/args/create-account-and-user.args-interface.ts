import { ApiProperty } from '@nestjs/swagger';

export interface ICreateAccountAndUserArgs {
  accountName: string;
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
}

export class CreateAccountAndUserRequestBody
  implements ICreateAccountAndUserArgs
{
  @ApiProperty({ type: String })
  accountName: string;
  @ApiProperty({ type: String, description: 'Must be unique' })
  email: string;
  @ApiProperty({ type: String })
  firstName: string;
  @ApiProperty({ type: String, required: false })
  lastName?: string | undefined;
  @ApiProperty({ type: String })
  password: string;
}
