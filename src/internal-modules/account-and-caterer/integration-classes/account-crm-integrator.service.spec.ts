import { Test, TestingModule } from '@nestjs/testing';
import { AccountCrmIntegratorService } from './account-crm-integrator.service';

describe('AccountCrmIntegratorService', () => {
  let service: AccountCrmIntegratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountCrmIntegratorService],
    }).compile();

    service = module.get<AccountCrmIntegratorService>(
      AccountCrmIntegratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
