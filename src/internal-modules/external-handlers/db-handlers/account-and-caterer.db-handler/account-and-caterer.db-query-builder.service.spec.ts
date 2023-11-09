import { Test, TestingModule } from '@nestjs/testing';
import { AccountAndCatererDbQueryBuilderService } from './account-and-caterer.db-query-builder.service';

describe('AccountAndCatererDbQueryBuilderService', () => {
  let service: AccountAndCatererDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountAndCatererDbQueryBuilderService],
    }).compile();

    service = module.get<AccountAndCatererDbQueryBuilderService>(AccountAndCatererDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
