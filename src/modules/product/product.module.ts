import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductScheduler } from '../import-excel/schedule/product-status-schedule';
import { AcceptanceService } from '../acceptance/acceptance.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService, ProductScheduler, AcceptanceService],
  controllers: [ProductController],
})
export class ProductModule {}
