import { Test, TestingModule } from '@nestjs/testing';
import { AccountAndCatererService } from 'src/internal-modules/account-and-caterer/account-and-caterer.service';
import { mockAccountAndCatererService } from 'test-utilities/mocks/providers/internal-modules/account-and-caterer/account-and-caterer.mock-provider';
import { AccountController } from './account.controller';

describe('AccountController', () => {
  let controller: AccountController;
  let accountAndCatererService: AccountAndCatererService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountAndCatererService,
          useValue: mockAccountAndCatererService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountAndCatererService = module.get<AccountAndCatererService>(
      AccountAndCatererService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
