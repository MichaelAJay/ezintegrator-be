import { ApiProperty } from '@nestjs/swagger';
import { ILoginArgs } from 'src/internal-modules/auth/interfaces';

export class LoginRequestBody implements ILoginArgs {
  @ApiProperty({ type: String })
  email: string;
  @ApiProperty({ type: String })
  password: string;
}
