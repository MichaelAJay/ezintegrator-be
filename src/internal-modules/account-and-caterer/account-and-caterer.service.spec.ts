import { Test, TestingModule } from '@nestjs/testing';
import { mockReturnCreateAccount } from '../../../test-utilities/mocks/returns/internal-modules/external-handlers/db-handlers/account-and-caterer.db-handler.returns';
import { mockAccountAndCatererDbHandlerService } from '../../../test-utilities';
import { mockUserService } from '../../../test-utilities/mocks/providers/internal-modules/user/user.mock-provider';
import { UserService } from '../user/user.service';
import { AccountAndCatererService } from './account-and-caterer.service';
import { ICreateAccountAndUserArgs } from './interfaces';
import { mockReturnLogin } from '../../../test-utilities/mocks/returns/internal-modules/auth-service.mock-returns';
import { AccountAndCatererDbHandlerService } from '../external-handlers/db-handlers/account-and-caterer.db-handler/account-and-caterer.db-handler.service';
import { AccountPermissionService } from '../security-utility/account-permission.service';
import { mockAccountPermissionService } from '../../../test-utilities/mocks/providers/internal-modules/security-utility/account-permission-service.mock-provider';

describe('AccountAndCatererService', () => {
  let service: AccountAndCatererService;
  let accountAndCatererDbHandler: AccountAndCatererDbHandlerService;
  let userService: UserService;
  let accountPermissionService: AccountPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountAndCatererService,
        {
          provide: AccountAndCatererDbHandlerService,
          useValue: mockAccountAndCatererDbHandlerService,
        },
        { provide: UserService, useValue: mockUserService },
        {
          provide: AccountPermissionService,
          useValue: mockAccountPermissionService,
        },
      ],
    }).compile();

    service = module.get<AccountAndCatererService>(AccountAndCatererService);
    accountAndCatererDbHandler = module.get<AccountAndCatererDbHandlerService>(
      AccountAndCatererDbHandlerService,
    );
    userService = module.get<UserService>(UserService);
    accountPermissionService = module.get<AccountPermissionService>(
      AccountPermissionService,
    );
  });

  describe('createAccount unit tests', () => {
    const input: ICreateAccountAndUserArgs = {
      accountName: 'MOCK ACCT NAME',
      email: 'mock@email.com',
      firstName: 'FIRSTNAME',
      password: 'MOCK_PASSWORD123',
    };
    const MOCK_ERROR = new Error('ERROR UNDER TEST');
    it('calls accountAndCatererDbHandler.createAccount once with the correct arguments', async () => {
      const spy = jest
        .spyOn(accountAndCatererDbHandler, 'createAccount')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));

      await service.createAccount(input).catch(() => {});

      // Primary tests
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        name: input.accountName,
        ownerEmail: input.email,
        contactEmail: input.email,
      });
    });
    describe('accountAndCatererDbHandler.createAccount throws error', () => {
      it('propagates the thrown error', async () => {
        jest
          .spyOn(accountAndCatererDbHandler, 'createAccount')
          .mockRejectedValue(MOCK_ERROR);

        await expect(service.createAccount(input)).rejects.toThrow(MOCK_ERROR);
      });
      it('does not call userService.create', async () => {
        const MOCK_ERROR = new Error('ERROR UNDER TEST');

        jest
          .spyOn(accountAndCatererDbHandler, 'createAccount')
          .mockRejectedValue(MOCK_ERROR);

        await service.createAccount(input).catch(() => {});
        expect(userService.create).not.toHaveBeenCalled();
      });
    });
    it('calls userService.create once with the correct args if incoming args excludes lastName', async () => {
      const mockCreateAccountReturn = mockReturnCreateAccount(
        input.accountName,
        input.email,
      );
      jest
        .spyOn(accountAndCatererDbHandler, 'createAccount')
        .mockResolvedValue(mockCreateAccountReturn);
      const spy = jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));
      await service.createAccount(input).catch(() => {});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        email: input.email,
        firstName: input.firstName,
        accountId: mockCreateAccountReturn.id,
        password: input.password,
      });
    });
    it('calls userService.create with the correct args if incoming args includes lastName', async () => {
      input.lastName = 'ADDED_LAST_NAME';
      const mockCreateAccountReturn = mockReturnCreateAccount(
        input.accountName,
        input.email,
      );
      jest
        .spyOn(accountAndCatererDbHandler, 'createAccount')
        .mockResolvedValue(mockCreateAccountReturn);
      const spy = jest
        .spyOn(userService, 'create')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));
      await service.createAccount(input).catch(() => {});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        accountId: mockCreateAccountReturn.id,
        password: input.password,
      });
    });
    it('propagates any error thrown by userService.create', async () => {
      const mockCreateAccountReturn = mockReturnCreateAccount(
        input.accountName,
        input.email,
      );
      jest
        .spyOn(accountAndCatererDbHandler, 'createAccount')
        .mockResolvedValue(mockCreateAccountReturn);
      jest.spyOn(userService, 'create').mockRejectedValue(MOCK_ERROR);
      await expect(service.createAccount(input)).rejects.toThrow(MOCK_ERROR);
    });
    it('returns tokens to immediately log user in', async () => {
      const mockResolvedValue = {
        userId: 'MOCK_USER_ID',
        tokens: mockReturnLogin(),
      };
      const mockCreateAccountReturn = mockReturnCreateAccount(
        input.accountName,
        input.email,
      );
      jest
        .spyOn(accountAndCatererDbHandler, 'createAccount')
        .mockResolvedValue(mockCreateAccountReturn);
      jest.spyOn(userService, 'create').mockResolvedValue(mockResolvedValue);

      const result = await service.createAccount(input);
      expect(result).toEqual(mockResolvedValue.tokens);
    });
  });

  afterEach(() => jest.clearAllMocks());
});
