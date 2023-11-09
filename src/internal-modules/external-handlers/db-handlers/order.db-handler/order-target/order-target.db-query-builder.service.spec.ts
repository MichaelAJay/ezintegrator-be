import { Test, TestingModule } from '@nestjs/testing';
import { OrderTargetDbQueryBuilderService } from './order-target.db-query-builder.service';

describe('OrderTargetDbQueryBuilderService', () => {
  let service: OrderTargetDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderTargetDbQueryBuilderService],
    }).compile();

    service = module.get<OrderTargetDbQueryBuilderService>(OrderTargetDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
