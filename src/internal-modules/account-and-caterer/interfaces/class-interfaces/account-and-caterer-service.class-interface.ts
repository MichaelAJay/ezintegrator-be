import { ICreateUserArgs } from 'src/internal-modules/user/interfaces';
import { IGetAuthAndRefreshTokens } from '../../../../internal-modules/security-utility';
import { ICreateAccountAndUserArgs } from '../args';

export interface IAccountAndCatererService {
  createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens>;

  // USER MANAGEMENT
  addUser(
    user: Omit<ICreateUserArgs, 'password'>,
    requesterId: string,
    accountId: string,
  ): Promise<any>;
}
