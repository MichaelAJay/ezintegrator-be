import { Test, TestingModule } from '@nestjs/testing';
import { NutshellApiClientConfigurationService } from './nutshell-api-client-configuration.service';

describe('NutshellApiClientConfigurationService', () => {
  let service: NutshellApiClientConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutshellApiClientConfigurationService],
    }).compile();

    service = module.get<NutshellApiClientConfigurationService>(NutshellApiClientConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
