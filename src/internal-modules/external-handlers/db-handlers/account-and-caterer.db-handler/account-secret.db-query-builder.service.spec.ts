import { Test, TestingModule } from '@nestjs/testing';
import { AccountSecretDbQueryBuilderService } from './account-secret.db-query-builder.service';

describe('AccountSecretDbQueryBuilderService', () => {
  let service: AccountSecretDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountSecretDbQueryBuilderService],
    }).compile();

    service = module.get<AccountSecretDbQueryBuilderService>(
      AccountSecretDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
