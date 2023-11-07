import { Test, TestingModule } from '@nestjs/testing';
import { AccountAndCatererService } from '../../internal-modules/account-and-caterer/account-and-caterer.service';
import { mockAccountAndCatererService } from '../../../test-utilities/mocks/providers/internal-modules/account-and-caterer/account-and-caterer.mock-provider';
import { AccountController } from './account.controller';
import { AccountIntegrationService } from '../../internal-modules/account-and-caterer/account-integration.service';
import { mockAccountIntegrationService } from '../../../test-utilities/mocks/providers/internal-modules/account-and-caterer/account-integration-service.mock-provider';

describe('AccountController', () => {
  let controller: AccountController;
  let accountAndCatererService: AccountAndCatererService;
  let accountIntegrationService: AccountIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountAndCatererService,
          useValue: mockAccountAndCatererService,
        },
        {
          provide: AccountIntegrationService,
          useValue: mockAccountIntegrationService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountAndCatererService = module.get<AccountAndCatererService>(
      AccountAndCatererService,
    );
    accountIntegrationService = module.get<AccountIntegrationService>(
      AccountIntegrationService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
