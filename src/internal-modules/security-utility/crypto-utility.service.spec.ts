import { Test, TestingModule } from '@nestjs/testing';
import { CryptoUtilityService } from './crypto-utility.service';

describe('CryptoUtilityService', () => {
  let service: CryptoUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoUtilityService],
    }).compile();

    service = module.get<CryptoUtilityService>(CryptoUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
