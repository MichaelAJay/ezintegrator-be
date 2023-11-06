import { Test, TestingModule } from '@nestjs/testing';
import { AccountIntegrationDbQueryBuilderService } from './account-integration.db-query-builder.service';

describe('AccountIntegrationDbQueryBuilderService', () => {
  let service: AccountIntegrationDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountIntegrationDbQueryBuilderService],
    }).compile();

    service = module.get<AccountIntegrationDbQueryBuilderService>(AccountIntegrationDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
