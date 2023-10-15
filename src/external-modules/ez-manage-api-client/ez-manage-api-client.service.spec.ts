import { Test, TestingModule } from '@nestjs/testing';
import { EzManageApiClientService } from './ez-manage-api-client.service';

describe('EzManageApiClientService', () => {
  let service: EzManageApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EzManageApiClientService],
    }).compile();

    service = module.get<EzManageApiClientService>(EzManageApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
