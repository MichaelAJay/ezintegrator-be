import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockJwtService } from '../../../test-utilities';
import { JwtHandlerService } from './jwt-handler.service';

describe('JwtHandlerService', () => {
  let service: JwtHandlerService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtHandlerService,
        { provide: JwtService, useValue: MockJwtService },
      ],
    }).compile();

    service = module.get<JwtHandlerService>(JwtHandlerService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
