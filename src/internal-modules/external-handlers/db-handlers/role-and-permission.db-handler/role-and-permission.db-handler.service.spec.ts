import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndPermissionDbHandlerService } from './role-and-permission.db-handler.service';

describe('RoleAndPermissionDbHandlerService', () => {
  let service: RoleAndPermissionDbHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAndPermissionDbHandlerService],
    }).compile();

    service = module.get<RoleAndPermissionDbHandlerService>(RoleAndPermissionDbHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
