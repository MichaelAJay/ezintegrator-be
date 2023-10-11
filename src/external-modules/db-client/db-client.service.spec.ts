import { Test, TestingModule } from '@nestjs/testing';
import { DbClientService } from './db-client.service';

describe('DbClientService', () => {
  let service: DbClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbClientService],
    }).compile();

    service = module.get<DbClientService>(DbClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
