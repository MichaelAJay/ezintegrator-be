import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  MockAccountAndCatererDbQueryBuilder,
  MockDbClient,
} from '../../../../../test-utilities';
import {
  AccountAndCatererDbHandlerService,
  AccountAndCatererDbQueryBuilderService,
} from '.';

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
          useValue: MockAccountAndCatererDbQueryBuilder,
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
