import { Module } from '@nestjs/common';
import { CatererController } from './caterer.controller';

@Module({
  controllers: [CatererController],
})
export class CatererApiModule {}
