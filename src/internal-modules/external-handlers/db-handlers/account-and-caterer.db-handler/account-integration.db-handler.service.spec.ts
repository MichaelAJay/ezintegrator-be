import { Test, TestingModule } from '@nestjs/testing';
import { AccountIntegrationDbHandlerService } from './account-integration.db-handler.service';

describe('AccountIntegrationDbHandlerService', () => {
  let service: AccountIntegrationDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountIntegrationDbHandlerService],
    }).compile();

    service = module.get<AccountIntegrationDbHandlerService>(AccountIntegrationDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
