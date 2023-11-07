import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import { MockDbClient } from '../../../../../test-utilities';
import { AccountSecretDbHandlerService } from './account-secret.db-handler.service';
import { AccountSecretDbQueryBuilderService } from './account-secret.db-query-builder.service';
import { mockAccountSecretDbQueryBuilder } from '../../../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-secret-db-query-builder.mock-provider';

describe('AccountSecretDbHandlerService', () => {
  let service: AccountSecretDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: AccountSecretDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountSecretDbHandlerService,
        { provide: DbClientService, useValue: MockDbClient },
        {
          provide: AccountSecretDbQueryBuilderService,
          useValue: mockAccountSecretDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<AccountSecretDbHandlerService>(
      AccountSecretDbHandlerService,
    );
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<AccountSecretDbQueryBuilderService>(
      AccountSecretDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
