import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { mockSecretManagerServiceClient } from '../../../test-utilities/mocks/providers/external-packages/secret-manager-service-client.mock-provider';
import { SecretManagerService } from './secret-manager.service';

describe('SecretManagerService', () => {
  let service: SecretManagerService;
  let client: SecretManagerServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretManagerService,
        {
          provide: 'SecretManagerServiceClient',
          useValue: mockSecretManagerServiceClient,
        },
      ],
    }).compile();

    service = module.get<SecretManagerService>(SecretManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
