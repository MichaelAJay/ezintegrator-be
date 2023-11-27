import { Test, TestingModule } from '@nestjs/testing';
import { CrmClientService } from './crm-client.service';

describe('CrmClientService', () => {
  let service: CrmClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmClientService],
    }).compile();

    service = module.get<CrmClientService>(CrmClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
