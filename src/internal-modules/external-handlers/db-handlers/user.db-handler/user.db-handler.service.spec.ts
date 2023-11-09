import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  MockDbClient,
  mockUserDbQueryBuilder,
} from '../../../../../test-utilities';
import { UserDbHandlerService } from './user.db-handler.service';
import { UserDbQueryBuilderService } from './user.db-query-builder.service';

// Skipping tests - too simple as of 31 Oct 2023
describe('UserDbHandlerService', () => {
  let service: UserDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: UserDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDbHandlerService,
        {
          provide: DbClientService,
          useValue: MockDbClient,
        },
        {
          provide: UserDbQueryBuilderService,
          useValue: mockUserDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<UserDbHandlerService>(UserDbHandlerService);
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<UserDbQueryBuilderService>(
      UserDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
