import { Test, TestingModule } from '@nestjs/testing';
import { AccountAndCatererService } from './account-and-caterer.service';

describe('AccountAndCatererService', () => {
  let service: AccountAndCatererService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountAndCatererService],
    }).compile();

    service = module.get<AccountAndCatererService>(AccountAndCatererService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
