import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from '../../../../../external-modules';
import { MockDbClient } from '../../../../../../test-utilities';
import { mockCrmIntegrationDbQueryBuilder } from '../../../../../../test-utilities/mocks/providers/internal-modules/external-handlers/db-handlers/integrations/crm-integration-db-query-builder.mock-provider';
import { CrmIntegrationDbHandlerService } from './crm-integration.db-handler.service';
import { CrmIntegrationDbQueryBuilderService } from './crm-integration.db-query-builder.service';

describe('CrmIntegrationDbHandlerService', () => {
  let service: CrmIntegrationDbHandlerService;
  let dbClient: DbClientService;
  let queryBuilder: CrmIntegrationDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmIntegrationDbHandlerService,
        { provide: DbClientService, useValue: MockDbClient },
        {
          provide: CrmIntegrationDbQueryBuilderService,
          useValue: mockCrmIntegrationDbQueryBuilder,
        },
      ],
    }).compile();

    service = module.get<CrmIntegrationDbHandlerService>(
      CrmIntegrationDbHandlerService,
    );
    dbClient = module.get<DbClientService>(DbClientService);
    queryBuilder = module.get<CrmIntegrationDbQueryBuilderService>(
      CrmIntegrationDbQueryBuilderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
