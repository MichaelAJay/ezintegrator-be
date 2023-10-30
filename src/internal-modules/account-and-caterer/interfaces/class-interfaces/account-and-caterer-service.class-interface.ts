import { IGetAuthAndRefreshTokens } from 'src/internal-modules/security-utility';
import { ICreateAccountAndUserArgs } from '../args';

export interface IAccountAndCatererService {
  createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens>;
}
