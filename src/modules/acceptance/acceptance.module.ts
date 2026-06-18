import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Acceptance } from './entities/acceptance.entity';
import { ProductEntity } from '../product/entities/product.entity';

import { AcceptanceController } from './acceptance.controller';
import { AcceptanceService } from './acceptance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Acceptance, ProductEntity])],
  controllers: [AcceptanceController],
  providers: [AcceptanceService],
  exports: [AcceptanceService],
})
export class AcceptanceModule {}
