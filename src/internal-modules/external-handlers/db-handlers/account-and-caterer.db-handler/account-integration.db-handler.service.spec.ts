import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import { MockDbClient } from '../../../../../test-utilities';
import { mockAccountIntegrationDbQueryBuilder } from '../../../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-integration-db-query-builder.mock-provider';
import { AccountIntegrationDbHandlerService } from './account-integration.db-handler.service';
import { AccountIntegrationDbQueryBuilderService } from './account-integration.db-query-builder.service';

describe('AccountIntegrationDbHandlerService', () => {
  let service: AccountIntegrationDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: AccountIntegrationDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountIntegrationDbHandlerService,
        { provide: DbClientService, useValue: MockDbClient },
        {
          provide: AccountIntegrationDbQueryBuilderService,
          useValue: mockAccountIntegrationDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<AccountIntegrationDbHandlerService>(
      AccountIntegrationDbHandlerService,
    );
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<AccountIntegrationDbQueryBuilderService>(
      AccountIntegrationDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
