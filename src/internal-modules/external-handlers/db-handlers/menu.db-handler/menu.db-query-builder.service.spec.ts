import { Test, TestingModule } from '@nestjs/testing';
import { MenuDbQueryBuilderService } from './menu.db-query-builder.service';

describe('MenuDbQueryBuilderService', () => {
  let service: MenuDbQueryBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuDbQueryBuilderService],
    }).compile();

    service = module.get<MenuDbQueryBuilderService>(MenuDbQueryBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
