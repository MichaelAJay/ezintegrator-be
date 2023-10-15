import { Test, TestingModule } from '@nestjs/testing';
import { NutshellApiClientService } from './nutshell-api-client.service';

describe('NutshellApiClientService', () => {
  let service: NutshellApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutshellApiClientService],
    }).compile();

    service = module.get<NutshellApiClientService>(NutshellApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
