import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  mockAccountAndCatererDbQueryBuilder,
  MockDbClient,
} from '../../../../../test-utilities';
import { AccountAndCatererDbHandlerService } from './account-and-caterer.db-handler.service';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';

describe('AccountAndCatererDbHandlerService', () => {
  let service: AccountAndCatererDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: AccountAndCatererDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountAndCatererDbHandlerService,
        {
          provide: DbClientService,
          useValue: MockDbClient,
        },
        {
          provide: AccountAndCatererDbQueryBuilderService,
          useValue: mockAccountAndCatererDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<AccountAndCatererDbHandlerService>(
      AccountAndCatererDbHandlerService,
    );
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<AccountAndCatererDbQueryBuilderService>(
      AccountAndCatererDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
