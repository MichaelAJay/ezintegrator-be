import { Test, TestingModule } from '@nestjs/testing';
import { SecretManagerService } from '../../secret-manager/secret-manager.service';
import { mockNutshellApiCacheService } from '../../../../test-utilities/mocks/providers/external-modules/crm-clients/nutshell-api-client/nutshell-api-cache.mock-provider';
import { mockSecretManagerService } from '../../../../test-utilities/mocks/providers/external-modules/secret-manager/secret-manager.mock-provider';
import { NutshellApiCacheService } from './nutshell-api-cache.service';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';

describe('NutshellApiClientConfigurationService', () => {
  let service: NutshellApiClientConfigurationService;
  let secretManager: SecretManagerService;
  let cache: NutshellApiCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutshellApiClientConfigurationService,
        { provide: SecretManagerService, useValue: mockSecretManagerService },
        {
          provide: NutshellApiCacheService,
          useValue: mockNutshellApiCacheService,
        },
      ],
    }).compile();

    service = module.get<NutshellApiClientConfigurationService>(
      NutshellApiClientConfigurationService,
    );
    secretManager = module.get<SecretManagerService>(SecretManagerService);
    cache = module.get<NutshellApiCacheService>(NutshellApiCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
