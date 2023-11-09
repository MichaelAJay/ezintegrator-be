import { Test, TestingModule } from '@nestjs/testing';
import { mockCrmIntegrationDbHandlerService } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/integrations/crm-integration-db-handler-service.mock-provider';
import { CrmIntegrationDbHandlerService } from '../external-handlers/db-handlers/integrations/crm-integration.db-handler/crm-integration.db-handler.service';
import { IntegrationUtilityService } from './integration-utility.service';

describe('IntegrationUtilityService', () => {
  let service: IntegrationUtilityService;
  let crmIntegrationDbHandler: CrmIntegrationDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegrationUtilityService,
        {
          provide: CrmIntegrationDbHandlerService,
          useValue: mockCrmIntegrationDbHandlerService,
        },
      ],
    }).compile();

    service = module.get<IntegrationUtilityService>(IntegrationUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
