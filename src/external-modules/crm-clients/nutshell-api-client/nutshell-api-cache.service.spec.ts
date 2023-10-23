import { Test, TestingModule } from '@nestjs/testing';
import { NutshellApiCacheService } from './nutshell-api-cache.service';

describe('NutshellApiCacheService', () => {
  let service: NutshellApiCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutshellApiCacheService],
    }).compile();

    service = module.get<NutshellApiCacheService>(NutshellApiCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
