import { IGetAuthAndRefreshTokens } from 'src/internal-modules/security-utility';
import { ICreateUserArgs } from '../args';

export interface IUserService {
  create(args: ICreateUserArgs): Promise<IGetAuthAndRefreshTokens>;
}
