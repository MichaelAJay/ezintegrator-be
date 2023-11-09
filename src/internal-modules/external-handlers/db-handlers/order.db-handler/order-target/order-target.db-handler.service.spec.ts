import { Test, TestingModule } from '@nestjs/testing';
import { OrderTargetDbHandlerService } from './order-target.db-handler.service';

describe('OrderTargetDbHandlerService', () => {
  let service: OrderTargetDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderTargetDbHandlerService],
    }).compile();

    service = module.get<OrderTargetDbHandlerService>(OrderTargetDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
