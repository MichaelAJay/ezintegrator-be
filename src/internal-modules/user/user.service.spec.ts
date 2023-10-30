import { Test, TestingModule } from '@nestjs/testing';
import { mockUserDbHandler } from '../../../test-utilities';
import { mockAuthService } from '../../../test-utilities/mocks/providers/internal-modules/auth/auth.mock-provider';
import { mockCryptoUtility } from '../../../test-utilities/mocks/providers/internal-modules/security-utility';
import { AuthService } from '../auth/auth.service';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userDbHandler: UserDbHandlerService;
  let cryptoUtility: CryptoUtilityService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserDbHandlerService, useValue: mockUserDbHandler },
        { provide: CryptoUtilityService, useValue: mockCryptoUtility },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userDbHandler = module.get<UserDbHandlerService>(UserDbHandlerService);
    cryptoUtility = module.get<CryptoUtilityService>(CryptoUtilityService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
