import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockReturnGenerateSaltAndHashValue } from '../../../test-utilities/mocks/returns/internal-modules/security-utility/crypto-utility-service.returns';
import { mockUserDbHandler } from '../../../test-utilities';
import { mockAuthService } from '../../../test-utilities/mocks/providers/internal-modules/auth/auth.mock-provider';
import { mockCryptoUtility } from '../../../test-utilities/mocks/providers/internal-modules/security-utility';
import {
  mockReturnCreateUser,
  mockReturnRetrieveUserByEmail,
} from '../../../test-utilities/mocks/returns/internal-modules/external-handlers/db-handlers/user.db-handler.returns';
import { AuthService } from '../auth/auth.service';
import { UserDbHandlerService } from '../external-handlers/db-handlers/user.db-handler';
import { CryptoUtilityService } from '../security-utility/crypto-utility.service';
import { ICreateUserArgs } from './interfaces';
import { UserService } from './user.service';
import { mockReturnLogin } from '../../../test-utilities/mocks/returns/internal-modules/auth-service.mock-returns';

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

  describe('create unit tests', () => {
    const input: ICreateUserArgs = {
      accountId: 'MOCK_ACCT_ID',
      email: 'MOCK@EMAIL.COM',
      firstName: 'FIRST_NAME',
      password: 'MOCK_PW_123',
    };
    it('calls userDbhandler.retrieveByEmail once with the correct arguments', async () => {
      // Short circuit remaining tests because they aren't relevant
      const spy = jest
        .spyOn(userDbHandler, 'retrieveByEmail')
        .mockRejectedValue(new Error());
      await service.create(input).catch(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(input.email);
      });
    });
    describe('existing user not found', () => {
      it('calls cryptoUtility.generateSaltAndHashValue once', async () => {
        jest
          .spyOn(userDbHandler, 'retrieveByEmail')
          .mockResolvedValue(mockReturnRetrieveUserByEmail(input.email, true));

        const spy = jest
          .spyOn(cryptoUtility, 'generateSaltAndHashValue')
          // Short circuit irrelevant section
          .mockRejectedValue(new Error('SHORT CIRCUIT'));

        await expect(service.create(input)).rejects.toThrow();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(input.password);
      });
      describe('cryptoUtility.generateSaltAndHashValue resolves', () => {
        it('calls userDbHandler.create once with the correct arguments', async () => {
          jest
            .spyOn(userDbHandler, 'retrieveByEmail')
            .mockResolvedValue(
              mockReturnRetrieveUserByEmail(input.email, true),
            );

          const mockHashAndSaltReturn = mockReturnGenerateSaltAndHashValue();
          jest
            .spyOn(cryptoUtility, 'generateSaltAndHashValue')
            .mockResolvedValue(mockHashAndSaltReturn);

          const spy = jest
            .spyOn(userDbHandler, 'create')
            .mockRejectedValue(new Error('SHORT CIRCUIT'));

          await service.create(input).catch(() => {});
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            ...input,
            hashedPassword: mockHashAndSaltReturn.hashedValue,
            salt: mockHashAndSaltReturn.salt,
          });
        });
        describe('userDbHandler.create resolves', () => {
          it('calls authService.login with the correct arguments', async () => {
            jest
              .spyOn(userDbHandler, 'retrieveByEmail')
              .mockResolvedValue(
                mockReturnRetrieveUserByEmail(input.email, true),
              );

            const mockSaltAndHash = mockReturnGenerateSaltAndHashValue();
            jest
              .spyOn(cryptoUtility, 'generateSaltAndHashValue')
              .mockResolvedValue(mockSaltAndHash);

            const mockCreatedUser = mockReturnCreateUser({
              ...input,
              hashedPassword: mockSaltAndHash.hashedValue,
              salt: mockSaltAndHash.salt,
            });
            jest
              .spyOn(userDbHandler, 'create')
              .mockResolvedValue(mockCreatedUser);

            const spy = jest
              .spyOn(authService, 'login')
              .mockRejectedValue(new Error('SHORT CIRCUIT'));

            // Catch short circuit
            await service.create(input).catch(() => {});
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({
              id: mockCreatedUser.id,
              salt: mockCreatedUser.salt,
            });
          });
          describe('authService.login resolves', () => {
            it('returns the resolved return from authService.login', async () => {
              jest
                .spyOn(userDbHandler, 'retrieveByEmail')
                .mockResolvedValue(
                  mockReturnRetrieveUserByEmail(input.email, true),
                );

              const mockSaltAndHash = mockReturnGenerateSaltAndHashValue();
              jest
                .spyOn(cryptoUtility, 'generateSaltAndHashValue')
                .mockResolvedValue(mockSaltAndHash);

              const mockCreatedUser = mockReturnCreateUser({
                ...input,
                hashedPassword: mockSaltAndHash.hashedValue,
                salt: mockSaltAndHash.salt,
              });
              jest
                .spyOn(userDbHandler, 'create')
                .mockResolvedValue(mockCreatedUser);

              const tokens = mockReturnLogin();
              jest.spyOn(authService, 'login').mockResolvedValue(tokens);

              const result = await service.create(input);
              expect(result).toEqual(tokens);
            });
          });
          describe('authService.login rejects', () => {
            it('propagates the thrown error', async () => {
              jest
                .spyOn(userDbHandler, 'retrieveByEmail')
                .mockResolvedValue(
                  mockReturnRetrieveUserByEmail(input.email, true),
                );

              const mockSaltAndHash = mockReturnGenerateSaltAndHashValue();
              jest
                .spyOn(cryptoUtility, 'generateSaltAndHashValue')
                .mockResolvedValue(mockSaltAndHash);

              jest.spyOn(userDbHandler, 'create').mockResolvedValue(
                mockReturnCreateUser({
                  ...input,
                  hashedPassword: mockSaltAndHash.hashedValue,
                  salt: mockSaltAndHash.salt,
                }),
              );

              const MOCK_ERROR = new Error('ERROR UNDER TEST');
              jest.spyOn(authService, 'login').mockRejectedValue(MOCK_ERROR);
              await expect(service.create(input)).rejects.toThrow(MOCK_ERROR);
            });
          });
        });
        describe('userDbHandler.create rejects', () => {
          it('propagates the thrown error', async () => {
            const MOCK_ERROR = new Error('ERROR UNDER TEST');
            jest
              .spyOn(userDbHandler, 'retrieveByEmail')
              .mockRejectedValue(MOCK_ERROR);

            await expect(service.create(input)).rejects.toThrow(MOCK_ERROR);
          });
          it('does not call the remaining functions', async () => {
            const MOCK_ERROR = new Error('ERROR UNDER TEST');
            jest
              .spyOn(userDbHandler, 'retrieveByEmail')
              .mockRejectedValue(MOCK_ERROR);

            await service.create(input).catch(() => {});
            expect(authService.login).not.toHaveBeenCalled();
          });
        });
      });
      describe('cryptoUtility.generateSaltAndHashValue rejects', () => {
        it('propagates the error', async () => {
          jest
            .spyOn(userDbHandler, 'retrieveByEmail')
            .mockResolvedValue(
              mockReturnRetrieveUserByEmail(input.email, true),
            );

          const MOCK_ERROR = new Error('ERROR UNDER TEST');
          jest
            .spyOn(cryptoUtility, 'generateSaltAndHashValue')
            .mockRejectedValue(MOCK_ERROR);

          await expect(service.create(input)).rejects.toThrow(MOCK_ERROR);
        });
        it('does not call the remaining functions', async () => {
          jest
            .spyOn(userDbHandler, 'retrieveByEmail')
            .mockResolvedValue(
              mockReturnRetrieveUserByEmail(input.email, true),
            );

          const MOCK_ERROR = new Error('ERROR UNDER TEST');
          jest
            .spyOn(cryptoUtility, 'generateSaltAndHashValue')
            .mockRejectedValue(MOCK_ERROR);

          await service.create(input).catch(() => {});
          expect(userDbHandler.create).not.toHaveBeenCalled();
          expect(authService.login).not.toHaveBeenCalled();
        });
      });
    });
    // Written and passing - 30 Oct '23
    describe('existing user found', () => {
      it('throws a ConflictException error', async () => {
        jest
          .spyOn(userDbHandler, 'retrieveByEmail')
          .mockResolvedValue(mockReturnRetrieveUserByEmail(input.email, false));

        await expect(service.create(input)).rejects.toBeInstanceOf(
          ConflictException,
        );
      });
      it('does not call the remaining functions', async () => {
        jest
          .spyOn(userDbHandler, 'retrieveByEmail')
          .mockResolvedValue(mockReturnRetrieveUserByEmail(input.email, false));

        await service.create(input).catch(() => {});
        expect(cryptoUtility.generateSaltAndHashValue).not.toHaveBeenCalled();
        expect(userDbHandler.create).not.toHaveBeenCalled();
        expect(authService.login).not.toHaveBeenCalled();
      });
    });
  });

  afterEach(() => jest.clearAllMocks());
});
