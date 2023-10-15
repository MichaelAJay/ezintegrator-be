import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  MockDbClient,
  MockUserDbQueryBuilder,
} from '../../../../../test-utilities';
import { UserDbHandlerService, UserDbQueryBuilderService } from '.';

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
          useValue: MockUserDbQueryBuilder,
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
