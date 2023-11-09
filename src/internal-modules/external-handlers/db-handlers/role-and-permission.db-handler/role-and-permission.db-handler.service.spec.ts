import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../external-modules';
import { MockDbClient } from '../../../../../test-utilities';
import { mockRoleAndPermissionDbQueryBuilder } from '../../../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/role-and-permission.db-handler/role-and-permission-db-query-builder.mock-provider';
import { RoleAndPermissionDbHandlerService } from './role-and-permission.db-handler.service';
import { RoleAndPermissionDbQueryBuilderService } from './role-and-permission.db-query-builder.service';

describe('RoleAndPermissionDbHandlerService', () => {
  let service: RoleAndPermissionDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: RoleAndPermissionDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleAndPermissionDbHandlerService,
        { provide: DbClientService, useValue: MockDbClient },
        {
          provide: RoleAndPermissionDbQueryBuilderService,
          useValue: mockRoleAndPermissionDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<RoleAndPermissionDbHandlerService>(
      RoleAndPermissionDbHandlerService,
    );
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<RoleAndPermissionDbQueryBuilderService>(
      RoleAndPermissionDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
