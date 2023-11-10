import { ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperationTags } from '../tags';

export const loginApiOperationOptions: ApiOperationOptions = {
  summary: 'Authenticates user',
  description:
    'If user with given email is found in system and password is validated, generates access & refresh tokens & updates user record with generated refresh token',
  tags: [ApiOperationTags.Auth],
};
