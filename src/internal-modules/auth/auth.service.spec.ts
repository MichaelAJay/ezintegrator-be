import { Test, TestingModule } from '@nestjs/testing';
import { mockUserDbHandler } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/user.db-handler';
import {
  mockCryptoUtility,
  mockJwtHander,
} from '../../../test-utilities/mocks/providers/internal-modules/security-utility';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { JwtHandlerService } from '../security-utility/jwt-handler.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userDbHandler: UserDbHandlerService;
  let cryptoHandler: CryptoUtilityService;
  let jwtHandler: JwtHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserDbHandlerService, useValue: mockUserDbHandler },
        { provide: CryptoUtilityService, useValue: mockCryptoUtility },
        { provide: JwtHandlerService, useValue: mockJwtHander },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userDbHandler = module.get<UserDbHandlerService>(UserDbHandlerService);
    cryptoHandler = module.get<CryptoUtilityService>(CryptoUtilityService);
    jwtHandler = module.get<JwtHandlerService>(JwtHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
