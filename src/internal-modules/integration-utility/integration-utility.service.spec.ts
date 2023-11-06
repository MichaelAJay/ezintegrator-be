import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationUtilityService } from './integration-utility.service';

describe('IntegrationUtilityService', () => {
  let service: IntegrationUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationUtilityService],
    }).compile();

    service = module.get<IntegrationUtilityService>(IntegrationUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
