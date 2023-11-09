import { Test, TestingModule } from '@nestjs/testing';
import { mockIntegrationUtilityService } from '../../../test-utilities/mocks/providers/internal-modules/integration-utility/integration-utility-service.mock-provider';
import { IntegrationUtilityService } from '../../internal-modules/integration-utility/integration-utility.service';
import { IntegrationController } from './integration.controller';

describe('IntegrationController', () => {
  let controller: IntegrationController;
  let integrationUtilityService: IntegrationUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationController],
      providers: [
        {
          provide: IntegrationUtilityService,
          useValue: mockIntegrationUtilityService,
        },
      ],
    }).compile();

    controller = module.get<IntegrationController>(IntegrationController);
    integrationUtilityService = module.get<IntegrationUtilityService>(
      IntegrationUtilityService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
