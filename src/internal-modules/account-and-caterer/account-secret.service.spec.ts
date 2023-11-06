import { Test, TestingModule } from '@nestjs/testing';
import { SecretManagerService } from '../../external-modules/secret-manager/secret-manager.service';
import { mockSecretManagerService } from '../../../test-utilities/mocks/providers/external-modules/secret-manager/secret-manager.mock-provider';
import { mockAccountIntegrationService } from '../../../test-utilities/mocks/providers/internal-modules/account-and-caterer/account-integration-service.mock-provider';
import { mockAccountIntegrationDbHandlerService } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-intregation-db-handler-service.mock-provider';
import { mockAccountSecretDbHandlerService } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler/account-secret-db-handler-service.mock-provider';
import { mockAccountPermissionService } from '../../../test-utilities/mocks/providers/internal-modules/security-utility/account-permission-service.mock-provider';
import { AccountIntegrationDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-integration.db-handler.service';
import { AccountSecretDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-secret.db-handler.service';
import { AccountPermissionService } from '../security-utility/account-permission.service';
import { AccountIntegrationService } from './account-integration.service';
import { AccountSecretService } from './account-secret.service';

describe('AccountSecretService', () => {
  let service: AccountSecretService;
  let accountPermissionService: AccountPermissionService;
  let accountSecretDbHandler: AccountSecretDbHandlerService;
  let secretManagerService: SecretManagerService;
  let accountIntegrationService: AccountIntegrationService;
  let accountIntegrationDbHandler: AccountIntegrationDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountSecretService,
        {
          provide: AccountPermissionService,
          useValue: mockAccountPermissionService,
        },
        {
          provide: AccountSecretDbHandlerService,
          useValue: mockAccountSecretDbHandlerService,
        },
        { provide: SecretManagerService, useValue: mockSecretManagerService },
        {
          provide: AccountIntegrationService,
          useValue: mockAccountIntegrationService,
        },
        {
          provide: AccountIntegrationDbHandlerService,
          useValue: mockAccountIntegrationDbHandlerService,
        },
      ],
    }).compile();

    service = module.get<AccountSecretService>(AccountSecretService);
    accountPermissionService = module.get<AccountPermissionService>(
      AccountPermissionService,
    );
    accountSecretDbHandler = module.get<AccountSecretDbHandlerService>(
      AccountSecretDbHandlerService,
    );
    secretManagerService =
      module.get<SecretManagerService>(SecretManagerService);
    accountIntegrationService = module.get<AccountIntegrationService>(
      AccountIntegrationService,
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
