import { NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockReturnRetrieveUserByEmail,
  mockReturnRetrieveUserById,
  mockReturnUpdateUser,
} from '../../../test-utilities/mocks/returns/internal-modules/external-handlers/db-handlers/user.db-handler.returns';
import { mockUserDbHandler } from '../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/user.db-handler';
import {
  mockCryptoUtility,
  mockJwtHander,
} from '../../../test-utilities/mocks/providers/internal-modules/security-utility';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { JwtHandlerService } from '../security-utility/jwt-handler.service';
import { AuthService } from './auth.service';
import { ILoginArgs } from './interfaces';
import { mockReturnLogin } from '../../../test-utilities/mocks/returns/internal-modules/auth-service.mock-returns';
import { mockReturnJwtHandlerVerifyWithSecret } from '../../../test-utilities/mocks/returns/internal-modules/security-utility/jwt-handler-service.returns';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler/user.db-handler.service';

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

  describe('authenticate unit tests', () => {
    const loginArgs: ILoginArgs = {
      email: 'MOCK@EMAIL.COM',
      password: 'PASSWORD123',
    };
    it('calls userDbHandler.retrieveByEmail once with the correct args', async () => {
      const spy = jest
        .spyOn(userDbHandler, 'retrieveByEmail')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));

      // Remaining execution not required
      await service.authenticate(loginArgs).catch(() => {});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(loginArgs.email);
    });
    describe('userDbHandler.retrieveByEmail resolves to user record', () => {
      const mockUser = mockReturnRetrieveUserByEmail(loginArgs.email, false);
      it('calls cryptoHandler.validateSaltedHash once with the correct args', async () => {
        jest
          .spyOn(userDbHandler, 'retrieveByEmail')
          .mockResolvedValue(mockUser);

        const spy = jest
          .spyOn(cryptoHandler, 'validateSaltedHash')
          .mockRejectedValue(new Error('SHORT CIRCUIT'));

        // Catch short circuit
        await service.authenticate(loginArgs).catch(() => {});
        // BACKGROUND TEST
        expect(mockUser).toBeDefined();

        // Primary tests
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          loginArgs.password,
          mockUser?.hashedPassword,
          mockUser?.salt,
        );
      });
      describe('cryptoHandler.validateSaltedHash resolves', () => {
        describe('cryptoHandler.validateSaltedHash resolves to true', () => {
          it('calls authService.login once with the correct args', async () => {
            jest
              .spyOn(userDbHandler, 'retrieveByEmail')
              .mockResolvedValue(mockUser);
            jest
              .spyOn(cryptoHandler, 'validateSaltedHash')
              .mockResolvedValue(true);

            const spy = jest
              .spyOn(service, 'login')
              .mockResolvedValue(mockReturnLogin());

            await service.authenticate(loginArgs);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(mockUser);
          });
          describe('service.login resolves', () => {
            it('returns the resolved value from service.login', async () => {
              jest
                .spyOn(userDbHandler, 'retrieveByEmail')
                .mockResolvedValue(mockUser);
              jest
                .spyOn(cryptoHandler, 'validateSaltedHash')
                .mockResolvedValue(true);

              const mockReturnLoginResult = mockReturnLogin();
              jest
                .spyOn(service, 'login')
                .mockResolvedValue(mockReturnLoginResult);

              const result = await service.authenticate(loginArgs);
              expect(result).toEqual(mockReturnLoginResult);
            });
          });
          describe('service.login rejects', () => {
            it('propagates thrown error from service.login', async () => {
              jest
                .spyOn(userDbHandler, 'retrieveByEmail')
                .mockResolvedValue(mockUser);
              jest
                .spyOn(cryptoHandler, 'validateSaltedHash')
                .mockResolvedValue(true);

              const MOCK_ERROR = new Error('Error under test');
              jest.spyOn(service, 'login').mockRejectedValue(MOCK_ERROR);
              await expect(service.authenticate(loginArgs)).rejects.toThrow(
                MOCK_ERROR,
              );
            });
          });
        });
      });
      describe('cryptoHandler.validateSaltedHash rejects or resolves to false', () => {
        it('propagates a thrown error from cryptoHandler.validateSaltedHash and does not call authService.login', async () => {
          jest
            .spyOn(userDbHandler, 'retrieveByEmail')
            .mockResolvedValue(mockUser);

          const MOCK_ERROR = new Error('ERROR UNDER TEST');
          jest
            .spyOn(cryptoHandler, 'validateSaltedHash')
            .mockRejectedValue(MOCK_ERROR);

          await expect(service.authenticate(loginArgs)).rejects.toThrow(
            MOCK_ERROR,
          );
          expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
        });
        it('throws UnauthorizedException if cryptoHandler.validateSaltedHash resolves to false and does not call authService.login', async () => {
          jest
            .spyOn(userDbHandler, 'retrieveByEmail')
            .mockResolvedValue(mockUser);

          jest
            .spyOn(cryptoHandler, 'validateSaltedHash')
            .mockResolvedValue(false);

          await expect(service.authenticate(loginArgs)).rejects.toThrow(
            UnauthorizedException,
          );
          expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
        });
      });
    });
    describe('userDbHandler.retrieveByEmail rejects or returns null', () => {
      it('propagates thrown error if userDbHandler.retrieveByEmail rejects and does not call further functions', async () => {
        // Further functions include cryptoHandler.validateSaltedHash and authService.login
        const MOCK_ERROR = new Error('ERROR UNDER TEST');
        jest
          .spyOn(userDbHandler, 'retrieveByEmail')
          .mockRejectedValue(MOCK_ERROR);

        await expect(service.authenticate(loginArgs)).rejects.toThrow(
          MOCK_ERROR,
        );
        expect(
          jest.spyOn(cryptoHandler, 'validateSaltedHash'),
        ).not.toHaveBeenCalled();
        expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
      });
      it('throws UnauthorizedException if userDbHandler.retrieveByEmail returns null and does not call further functions', async () => {
        // Further functions include cryptoHandler.validateSaltedHash and authService.login

        jest.spyOn(userDbHandler, 'retrieveByEmail').mockResolvedValue(null);

        await expect(service.authenticate(loginArgs)).rejects.toThrow(
          UnauthorizedException,
        );
        expect(
          jest.spyOn(cryptoHandler, 'validateSaltedHash'),
        ).not.toHaveBeenCalled();
        expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * @TODO
   * 1) Try to consolidate some tests
   */
  describe('refresh unit tests', () => {
    const MOCK_TOKEN = 'MOCK_TOKEN';
    const SHORTCIRCUIT_ERROR = new Error('SHORT CIRCUIT');
    it('calls jwtHandler.verifyWithSecret once with the correct args', async () => {
      const spy = jest
        .spyOn(jwtHandler, 'verifyWithSecret')
        .mockRejectedValue(SHORTCIRCUIT_ERROR);

      // Background test: Handle shortcut error
      await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow();

      // Primary test
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(MOCK_TOKEN);
    });
    describe('jwtHandler.verifyWithSecret resolves', () => {
      const MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION =
        mockReturnJwtHandlerVerifyWithSecret();
      it('calls userDbHandler.retrieveById once with the correct args', async () => {
        jest
          .spyOn(jwtHandler, 'verifyWithSecret')
          .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

        const spy = jest
          .spyOn(userDbHandler, 'retrieveById')
          .mockRejectedValue(SHORTCIRCUIT_ERROR);

        // Background test: Handle shortcut error
        await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow();

        // Primary test
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION.sub,
        );
      });
      describe('userDbHandler.retrieveById resolves to a user record with non-null hashedRt', () => {
        const MOCK_USER_ID = 'MOCK_USER_ID';
        const MOCK_RETRIEVED_USER = mockReturnRetrieveUserById(
          MOCK_USER_ID,
          false,
        );
        it('calls cryptoService.validateSaltedHash with the correct args', async () => {
          jest
            .spyOn(jwtHandler, 'verifyWithSecret')
            .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

          jest
            .spyOn(userDbHandler, 'retrieveById')
            .mockResolvedValue(MOCK_RETRIEVED_USER);

          const spy = jest
            .spyOn(cryptoHandler, 'validateSaltedHash')
            .mockRejectedValue(SHORTCIRCUIT_ERROR);

          // Background test: handle shortcircuit error
          await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow();

          // Primary tests
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(
            MOCK_TOKEN,
            MOCK_RETRIEVED_USER?.hashedRt,
            MOCK_RETRIEVED_USER?.salt,
          );
        });
        describe('cryptoService.validateSaltedHash resolves to true', () => {
          it('calls authService.login once with the correct args', async () => {
            jest
              .spyOn(jwtHandler, 'verifyWithSecret')
              .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

            jest
              .spyOn(userDbHandler, 'retrieveById')
              .mockResolvedValue(MOCK_RETRIEVED_USER);

            jest
              .spyOn(cryptoHandler, 'validateSaltedHash')
              .mockResolvedValue(true);

            const spy = jest
              .spyOn(service, 'login')
              .mockResolvedValue(mockReturnLogin());

            await service.refresh(MOCK_TOKEN);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(MOCK_RETRIEVED_USER);
          });
          describe('authService.login resolves', () => {
            it('returns resolved promise value', async () => {
              jest
                .spyOn(jwtHandler, 'verifyWithSecret')
                .mockResolvedValue(
                  MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION,
                );

              jest
                .spyOn(userDbHandler, 'retrieveById')
                .mockResolvedValue(MOCK_RETRIEVED_USER);

              jest
                .spyOn(cryptoHandler, 'validateSaltedHash')
                .mockResolvedValue(true);

              const EXPECTED_RETURN = mockReturnLogin();
              jest.spyOn(service, 'login').mockResolvedValue(EXPECTED_RETURN);

              expect(await service.refresh(MOCK_TOKEN)).toEqual(
                EXPECTED_RETURN,
              );
            });
          });
          describe('authService.login rejects', () => {
            it('propagates error', async () => {
              jest
                .spyOn(jwtHandler, 'verifyWithSecret')
                .mockResolvedValue(
                  MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION,
                );

              jest
                .spyOn(userDbHandler, 'retrieveById')
                .mockResolvedValue(MOCK_RETRIEVED_USER);

              jest
                .spyOn(cryptoHandler, 'validateSaltedHash')
                .mockResolvedValue(true);

              const MOCK_ERROR = new Error('ERROR UNDER TEST');
              jest.spyOn(service, 'login').mockRejectedValue(MOCK_ERROR);

              await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(
                MOCK_ERROR,
              );
            });
          });
        });
        describe('cryptoHandler.validateSaltedHash rejects or resolves to false', () => {
          it('propagates error if cryptoHandler.validateSaltedHash rejects and further methods are not called', async () => {
            // Further methods include authService.login
            jest
              .spyOn(jwtHandler, 'verifyWithSecret')
              .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

            jest
              .spyOn(userDbHandler, 'retrieveById')
              .mockResolvedValue(MOCK_RETRIEVED_USER);

            const MOCK_ERROR = new Error('ERROR UNDER TEST');
            jest
              .spyOn(cryptoHandler, 'validateSaltedHash')
              .mockRejectedValue(MOCK_ERROR);

            await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(
              MOCK_ERROR,
            );
            expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
          });
          it('throws UnauthorizedException if crytpoHandler.validateSaltedHash resolves to false and further methods are not called', async () => {
            // Further methods include authService.login
            jest
              .spyOn(jwtHandler, 'verifyWithSecret')
              .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

            jest
              .spyOn(userDbHandler, 'retrieveById')
              .mockResolvedValue(MOCK_RETRIEVED_USER);

            jest
              .spyOn(cryptoHandler, 'validateSaltedHash')
              .mockResolvedValue(false);

            await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(
              UnauthorizedException,
            );
            expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
          });
        });
      });
      describe('userDbHandler.retrieveById rejects, resolves to null, or resolves to a record without hashedRt', () => {
        it('propagates error if userDbHandler.retrieveById rejects and further methods are not called', async () => {
          // Further methods include authService.login
          jest
            .spyOn(jwtHandler, 'verifyWithSecret')
            .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

          const MOCK_ERROR = new Error('ERROR UNDER TEST');
          jest
            .spyOn(userDbHandler, 'retrieveById')
            .mockRejectedValue(MOCK_ERROR);

          await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(MOCK_ERROR);
          expect(
            jest.spyOn(cryptoHandler, 'validateSaltedHash'),
          ).not.toHaveBeenCalled();
          expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
        });
        it('throws UnauthorizedException if userDbHandler.retrieveById returns null and further methods are not called', async () => {
          // Further methods include authService.login
          jest
            .spyOn(jwtHandler, 'verifyWithSecret')
            .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

          jest.spyOn(userDbHandler, 'retrieveById').mockResolvedValue(null);

          await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(
            UnauthorizedException,
          );
          expect(
            jest.spyOn(cryptoHandler, 'validateSaltedHash'),
          ).not.toHaveBeenCalled();
          expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
        });
        it('throws UnauthorizedException if userDbHandler.retrieveById returns a record with null hashedRt and further methods are not called', async () => {
          // Further methods include authService.login
          jest
            .spyOn(jwtHandler, 'verifyWithSecret')
            .mockResolvedValue(MOCK_JWTHANDLER_VERIFY_WITH_SECRET_RESOLUTION);

          const MOCK_USER = mockReturnRetrieveUserById('MOCK_USER_ID', false);
          (MOCK_USER as any).hashedRt = null;
          jest.spyOn(userDbHandler, 'retrieveById').mockResolvedValue(null);

          await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(
            UnauthorizedException,
          );
          expect(
            jest.spyOn(cryptoHandler, 'validateSaltedHash'),
          ).not.toHaveBeenCalled();
          expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
        });
      });
    });
    describe('jwtHandler.verifyWithSecret rejects', () => {
      it('propagates thrown error from jwthandler.verifyWithSecret and does not call remaining methods', async () => {
        // Remaining methods include userDbHandler.retrieveById, cryptoHandler.validateSaltedHash, or authService.login
        const MOCK_ERROR = new Error('ERROR UNDER TEST');
        jest
          .spyOn(jwtHandler, 'verifyWithSecret')
          .mockRejectedValue(MOCK_ERROR);

        await expect(service.refresh(MOCK_TOKEN)).rejects.toThrow(MOCK_ERROR);
        expect(
          jest.spyOn(userDbHandler, 'retrieveById'),
        ).not.toHaveBeenCalled();
        expect(
          jest.spyOn(cryptoHandler, 'validateSaltedHash'),
        ).not.toHaveBeenCalled();
        expect(jest.spyOn(service, 'login')).not.toHaveBeenCalled();
      });
    });
  });

  describe('login unit tests', () => {
    const loginArgs = {
      id: 'MOCK_USER_ID',
      salt: 'MOCK_SALT',
      accountId: 'MOCK_ACCT_ID',
    };
    it('calls jwtHandler.signAuthAndRefreshTokens with the correct args', async () => {
      const spy = jest
        .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
        .mockRejectedValue(new Error('SHORT CIRCUIT'));

      // Handles short circuit
      await expect(service.login(loginArgs)).rejects.toThrow();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        sub: loginArgs.id,
        acct: loginArgs.accountId,
      });
    });
    describe('jwtHandler.signAuthAndRefreshTokens resolves', () => {
      const mockTokens = mockReturnLogin();
      it('calls cryptoHandler.hash with the correct args', async () => {
        jest
          .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
          .mockResolvedValue(mockTokens);

        const spy = jest
          .spyOn(cryptoHandler, 'hash')
          .mockRejectedValue(new Error('SHORT CIRCUIT'));

        // Call method under test and handle short circuit
        await expect(service.login(loginArgs)).rejects.toThrow();

        // Primary tests
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(mockTokens.rt, loginArgs.salt);
      });
      describe('cryptoHandler.hash resolves', () => {
        const MOCK_HASH = 'MOCK_HASH';
        it('calls userDbHandler.update with the correct args', async () => {
          jest
            .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
            .mockResolvedValue(mockTokens);

          jest.spyOn(cryptoHandler, 'hash').mockResolvedValue(MOCK_HASH);

          const spy = jest
            .spyOn(userDbHandler, 'update')
            .mockRejectedValue(new Error('SHORT CIRCUIT'));

          // Call method under test and handle short circuit
          await expect(service.login(loginArgs)).rejects.toThrow();

          // Primary tests
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(loginArgs.id, {
            hashedRt: MOCK_HASH,
          });
        });
        describe('userDbHandler.update resolves', () => {
          it('returns the result from jwtHandler.signAuthAndRefreshTokens', async () => {
            jest
              .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
              .mockResolvedValue(mockTokens);

            jest.spyOn(cryptoHandler, 'hash').mockResolvedValue(MOCK_HASH);

            jest
              .spyOn(userDbHandler, 'update')
              .mockResolvedValue(mockReturnUpdateUser(loginArgs.id));

            const result = await service.login(loginArgs);
            expect(result).toEqual(mockTokens);
          });
        });
        describe('userDbHandler.update rejects', () => {
          it('propagates error from promise rejection', async () => {
            jest
              .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
              .mockResolvedValue(mockTokens);

            jest.spyOn(cryptoHandler, 'hash').mockResolvedValue(MOCK_HASH);

            const MOCK_ERROR = new Error('ERROR UNDER TEST');
            jest.spyOn(userDbHandler, 'update').mockRejectedValue(MOCK_ERROR);

            await expect(service.login(loginArgs)).rejects.toThrow(MOCK_ERROR);
          });
        });
      });
      describe('cryptoHandler.hash rejects', () => {
        it('propagates error from promise rejection and does not call userDbHandler.update', async () => {
          jest
            .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
            .mockResolvedValue(mockTokens);

          const MOCK_ERROR = new Error('ERROR UNDER TEST');
          jest.spyOn(cryptoHandler, 'hash').mockRejectedValue(MOCK_ERROR);

          await expect(service.login(loginArgs)).rejects.toThrow(MOCK_ERROR);
          expect(userDbHandler.update).not.toHaveBeenCalled();
        });
      });
    });
    describe('jwtHandler.signAuthAndRefreshTokens rejects', () => {
      it('propagates error from promise rejection and does not call remaining functions', async () => {
        // Remaining functions include cryptoHandler.hash and userDbHandler.update
        const MOCK_ERROR = new Error('ERROR UNDER TEST');
        jest
          .spyOn(jwtHandler, 'signAuthAndRefreshTokens')
          .mockRejectedValue(MOCK_ERROR);

        await expect(service.login(loginArgs)).rejects.toThrow(MOCK_ERROR);
        expect(cryptoHandler.hash).not.toHaveBeenCalled();
        expect(userDbHandler.update).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout unit tests', () => {
    it('throws NotImplementedException', async () => {
      await expect(service.logout('ANY STRING')).rejects.toThrow(
        NotImplementedException,
      );
    });
  });

  afterEach(() => jest.clearAllMocks());
});
