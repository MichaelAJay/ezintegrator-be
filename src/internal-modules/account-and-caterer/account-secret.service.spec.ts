import { Test, TestingModule } from '@nestjs/testing';
import { AccountSecretService } from './account-secret.service';

describe('AccountSecretService', () => {
  let service: AccountSecretService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountSecretService],
    }).compile();

    service = module.get<AccountSecretService>(AccountSecretService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
