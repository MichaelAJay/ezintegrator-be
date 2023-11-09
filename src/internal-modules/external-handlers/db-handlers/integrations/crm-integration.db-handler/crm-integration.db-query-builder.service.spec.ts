import { Test, TestingModule } from '@nestjs/testing';
import { CrmIntegrationDbQueryBuilderService } from './crm-integration.db-query-builder.service';

describe('CrmIntegrationDbQueryBuilderService', () => {
  let service: CrmIntegrationDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmIntegrationDbQueryBuilderService],
    }).compile();

    service = module.get<CrmIntegrationDbQueryBuilderService>(CrmIntegrationDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
