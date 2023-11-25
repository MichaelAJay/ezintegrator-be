import { Test, TestingModule } from '@nestjs/testing';
import { AccountIntegrationHelperService } from './account-integration-helper.service';

describe('AccountIntegrationHelperService', () => {
  let service: AccountIntegrationHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountIntegrationHelperService],
    }).compile();

    service = module.get<AccountIntegrationHelperService>(
      AccountIntegrationHelperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
