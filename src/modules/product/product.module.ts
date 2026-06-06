import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductScheduler } from '../import-excel/schedule/product-status-schedule';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService, ProductScheduler],
  controllers: [ProductController],
})
export class ProductModule {}
