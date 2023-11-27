import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCache } from '../../../../test-utilities/mocks/providers/external-packages/cache.mock-provider';
import { NutshellApiCacheService } from './nutshell-api-cache.service';

describe('NutshellApiCacheService', () => {
  let service: NutshellApiCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutshellApiCacheService,
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<NutshellApiCacheService>(NutshellApiCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
