import { Test, TestingModule } from '@nestjs/testing';
import { CrmIntegratorService } from './crm-integrator.service';

describe('CrmIntegratorService', () => {
  let service: CrmIntegratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmIntegratorService],
    }).compile();

    service = module.get<CrmIntegratorService>(CrmIntegratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
