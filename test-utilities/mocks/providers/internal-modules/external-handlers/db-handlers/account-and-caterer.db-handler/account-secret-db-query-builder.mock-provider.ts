import { IAccountSecretDbQueryBuilder } from '../../../../../../../src/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/interfaces/class-interfaces/account-secret-db-query-builder.class-interface';

export const mockAccountSecretDbQueryBuilder: IAccountSecretDbQueryBuilder = {
  buildCreateAccountSecretReference: jest.fn(),
};
