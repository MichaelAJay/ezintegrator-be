import { Test, TestingModule } from '@nestjs/testing';
import { mockNutshellApiCacheService } from '../../../../test-utilities/mocks/providers/external-modules/crm-clients/nutshell-api-client/nutshell-api-cache.mock-provider';
import { mockNutshellApiClientConfigurationService } from '../../../../test-utilities/mocks/providers/external-modules/crm-clients/nutshell-api-client/nutshell-api-client-configuration.mock-provider';
import { NutshellApiCacheService } from './nutshell-api-cache.service';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';
import { NutshellApiClientService } from './nutshell-api-client.service';

describe('NutshellApiClientService', () => {
  let service: NutshellApiClientService;
  let clientConfiguration: NutshellApiClientConfigurationService;
  let cache: NutshellApiCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutshellApiClientService,
        {
          provide: NutshellApiClientConfigurationService,
          useValue: mockNutshellApiClientConfigurationService,
        },
        {
          provide: NutshellApiCacheService,
          useValue: mockNutshellApiCacheService,
        },
      ],
    }).compile();

    service = module.get<NutshellApiClientService>(NutshellApiClientService);
    clientConfiguration = module.get<NutshellApiClientConfigurationService>(
      NutshellApiClientConfigurationService,
    );
    cache = module.get<NutshellApiCacheService>(NutshellApiCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
