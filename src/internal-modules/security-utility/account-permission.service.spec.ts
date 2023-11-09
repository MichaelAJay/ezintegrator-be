import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAccountAndCatererDbHandlerService,
  mockUserDbHandler,
} from '../../../test-utilities';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';
import { AccountPermissionService } from './account-permission.service';

describe('AccountPermissionService', () => {
  let service: AccountPermissionService;
  let accountAndCatererDbHandler: AccountAndCatererDbHandlerService;
  let userDbHandler: UserDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountPermissionService,
        {
          provide: AccountAndCatererDbHandlerService,
          useValue: mockAccountAndCatererDbHandlerService,
        },
        { provide: UserDbHandlerService, useValue: mockUserDbHandler },
      ],
    }).compile();

    service = module.get<AccountPermissionService>(AccountPermissionService);
    accountAndCatererDbHandler = module.get<AccountAndCatererDbHandlerService>(
      AccountAndCatererDbHandlerService,
    );
    userDbHandler = module.get<UserDbHandlerService>(UserDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
