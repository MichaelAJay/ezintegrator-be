import { Test, TestingModule } from '@nestjs/testing';
import { AccountIntegrationDbHandlerService } from '../../../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { mockAccountIntegrationDbHandlerService } from '../../../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-intregation-db-handler-service.mock-provider';
import { AccountCrmIntegratorService } from './account-crm-integrator.service';

describe('AccountCrmIntegratorService', () => {
  let service: AccountCrmIntegratorService;
  let accountIntegrationDbHandler: AccountIntegrationDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountCrmIntegratorService,
        {
          provide: AccountIntegrationDbHandlerService,
          useValue: mockAccountIntegrationDbHandlerService,
        },
      ],
    }).compile();

    service = module.get<AccountCrmIntegratorService>(
      AccountCrmIntegratorService,
    );
    accountIntegrationDbHandler =
      module.get<AccountIntegrationDbHandlerService>(
        AccountIntegrationDbHandlerService,
      );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
