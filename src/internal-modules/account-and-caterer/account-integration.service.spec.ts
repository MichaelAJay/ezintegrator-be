import { Test, TestingModule } from '@nestjs/testing';
import { mockAccountCrmIntegrator } from '../../../test-utilities/mocks/providers/internal-modules/account-and-caterer/integration-classes/account-crm-integrator-service.mock-provider';
import { mockAccountIntegrationDbHandlerService } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-intregation-db-handler-service.mock-provider';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountIntegrationService } from './account-integration.service';
import { AccountCrmIntegratorService } from './integration-classes/account-crm-integrator.service';

describe('AccountIntegrationService', () => {
  let service: AccountIntegrationService;
  let accountIntegrationDbHandler: AccountIntegrationDbHandlerService;
  let accountCrmIntegrator: AccountCrmIntegratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountIntegrationService,
        {
          provide: AccountIntegrationDbHandlerService,
          useValue: mockAccountIntegrationDbHandlerService,
        },
        {
          provide: AccountCrmIntegratorService,
          useValue: mockAccountCrmIntegrator,
        },
      ],
    }).compile();

    service = module.get<AccountIntegrationService>(AccountIntegrationService);
    accountIntegrationDbHandler =
      module.get<AccountIntegrationDbHandlerService>(
        AccountIntegrationDbHandlerService,
      );
    accountCrmIntegrator = module.get<AccountCrmIntegratorService>(
      AccountCrmIntegratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
