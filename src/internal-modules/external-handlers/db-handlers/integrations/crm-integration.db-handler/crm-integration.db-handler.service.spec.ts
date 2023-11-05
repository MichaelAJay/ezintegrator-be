import { Test, TestingModule } from '@nestjs/testing';
import { CrmIntegrationDbHandlerService } from './crm-integration.db-handler.service';

describe('CrmIntegrationDbHandlerService', () => {
  let service: CrmIntegrationDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmIntegrationDbHandlerService],
    }).compile();

    service = module.get<CrmIntegrationDbHandlerService>(CrmIntegrationDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
