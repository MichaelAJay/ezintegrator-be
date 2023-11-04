import {
  AccountSecretReferenceSecretTypeValues,
  AccountSecretReferenceTargetTypeValues,
} from 'src/external-modules';
import { IGetAuthAndRefreshTokens } from '../../../../internal-modules/security-utility';
import { ICreateAccountAndUserArgs } from '../args';

export interface IAccountAndCatererService {
  createAccount(
    args: ICreateAccountAndUserArgs,
  ): Promise<IGetAuthAndRefreshTokens>;
  upsertSecret(
    userId: string,
    accountId: string,
    referenceType: AccountSecretReferenceTargetTypeValues,
    secretType: AccountSecretReferenceSecretTypeValues,
    secretPayload: string | Buffer,
  ): any;
  getReferenceIdForAccountReferenceType(
    accountId: string,
    referenceType: AccountSecretReferenceTargetTypeValues,
  ): any;
}
