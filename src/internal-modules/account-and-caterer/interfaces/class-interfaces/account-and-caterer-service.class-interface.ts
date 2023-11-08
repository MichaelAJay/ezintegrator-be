import { IGetAuthAndRefreshTokens } from '../../../../internal-modules/security-utility';
import { ICreateAccountAndUserArgs } from '../args';

export interface IAccountAndCatererService {
  createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens>;

  // USER MANAGEMENT
  addUser(email: string, userId: string, accountId: string): Promise<any>;
}
