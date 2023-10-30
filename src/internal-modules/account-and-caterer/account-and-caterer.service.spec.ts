import { Test, TestingModule } from '@nestjs/testing';
import { mockAccountAndCatererDbHandlerService } from '../../../test-utilities';
import { mockUserService } from '../../../test-utilities/mocks/providers/internal-modules/user/user.mock-provider';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler';
import { UserService } from '../user/user.service';
import { AccountAndCatererService } from './account-and-caterer.service';

describe('AccountAndCatererService', () => {
  let service: AccountAndCatererService;
  let accountAndCatererDbHandler: AccountAndCatererDbHandlerService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountAndCatererService,
        {
          provide: AccountAndCatererDbHandlerService,
          useValue: mockAccountAndCatererDbHandlerService,
        },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AccountAndCatererService>(AccountAndCatererService);
    accountAndCatererDbHandler = module.get<AccountAndCatererDbHandlerService>(
      AccountAndCatererDbHandlerService,
    );
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
