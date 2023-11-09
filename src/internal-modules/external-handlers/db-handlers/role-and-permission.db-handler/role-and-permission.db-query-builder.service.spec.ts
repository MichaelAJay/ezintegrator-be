import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndPermissionDbQueryBuilderService } from './role-and-permission.db-query-builder.service';

describe('RoleAndPermissionDbQueryBuilderService', () => {
  let service: RoleAndPermissionDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAndPermissionDbQueryBuilderService],
    }).compile();

    service = module.get<RoleAndPermissionDbQueryBuilderService>(RoleAndPermissionDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
