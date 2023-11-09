import { Test, TestingModule } from '@nestjs/testing';
import { OrderDbQueryBuilderService } from './order.db-query-builder.service';

describe('OrderDbQueryBuilderService', () => {
  let service: OrderDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderDbQueryBuilderService],
    }).compile();

    service = module.get<OrderDbQueryBuilderService>(OrderDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
