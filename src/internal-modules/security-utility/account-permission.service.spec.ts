import { Test, TestingModule } from '@nestjs/testing';
import { mockAccountAndCatererDbHandlerService } from '../../../test-utilities';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { AccountPermissionService } from './account-permission.service';

describe('AccountPermissionService', () => {
  let service: AccountPermissionService;
  let accountAndCatererDbHandler: AccountAndCatererDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountPermissionService,
        {
          provide: AccountAndCatererDbHandlerService,
          useValue: mockAccountAndCatererDbHandlerService,
        },
      ],
    }).compile();

    service = module.get<AccountPermissionService>(AccountPermissionService);
    accountAndCatererDbHandler = module.get<AccountAndCatererDbHandlerService>(
      AccountAndCatererDbHandlerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
