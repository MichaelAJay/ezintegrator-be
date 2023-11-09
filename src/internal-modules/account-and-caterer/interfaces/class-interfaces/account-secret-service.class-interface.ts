import { IAddCrmSecretArgs } from '..';

export interface IAccountSecretProvider {
  addCrmSecret(
    secret: IAddCrmSecretArgs,
    userId: string,
    accountId: string,
  ): any;
}
