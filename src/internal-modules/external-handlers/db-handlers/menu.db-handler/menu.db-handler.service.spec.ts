import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  MockMenuDbQueryBuilder,
  MockDbClient,
} from '../../../../../test-utilities';
import { MenuDbHandlerService, MenuDbQueryBuilderService } from '.';

describe('MenuDbHandlerService', () => {
  let service: MenuDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: MenuDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuDbHandlerService,
        {
          provide: DbClientService,
          useValue: MockDbClient,
        },
        {
          provide: MenuDbQueryBuilderService,
          useValue: MockMenuDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<MenuDbHandlerService>(MenuDbHandlerService);
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<MenuDbQueryBuilderService>(
      MenuDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
