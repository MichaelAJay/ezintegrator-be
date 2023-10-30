import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import {
  mockOrderDbQueryBuilder,
  MockDbClient,
} from '../../../../../test-utilities';
import { OrderDbHandlerService, OrderDbQueryBuilderService } from '.';

describe('OrderDbHandlerService', () => {
  let service: OrderDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: OrderDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDbHandlerService,
        {
          provide: DbClientService,
          useValue: MockDbClient,
        },
        {
          provide: OrderDbQueryBuilderService,
          useValue: mockOrderDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<OrderDbHandlerService>(OrderDbHandlerService);
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<OrderDbQueryBuilderService>(
      OrderDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
