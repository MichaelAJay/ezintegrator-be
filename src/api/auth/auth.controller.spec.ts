import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../internal-modules/auth/auth.service';
import { mockAuthService } from '../../../test-utilities/mocks/providers/internal-modules/auth/auth.mock-provider';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
