import { Test, TestingModule } from '@nestjs/testing';
import { AccountSecretDbHandlerService } from './account-secret.db-handler.service';

describe('AccountSecretDbHandlerService', () => {
  let service: AccountSecretDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountSecretDbHandlerService],
    }).compile();

    service = module.get<AccountSecretDbHandlerService>(AccountSecretDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
