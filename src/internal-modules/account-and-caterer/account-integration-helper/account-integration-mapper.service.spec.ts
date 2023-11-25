import { Test, TestingModule } from '@nestjs/testing';
import { AccountIntegrationMapperService } from './account-integration-mapper.service';

describe('AccountCrmMapperService', () => {
  let service: AccountIntegrationMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountIntegrationMapperService],
    }).compile();

    service = module.get<AccountIntegrationMapperService>(
      AccountIntegrationMapperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
