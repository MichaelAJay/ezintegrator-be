import { Test, TestingModule } from '@nestjs/testing';
import { CatererController } from './caterer.controller';

describe('CatererController', () => {
  let controller: CatererController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatererController],
    }).compile();

    controller = module.get<CatererController>(CatererController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
