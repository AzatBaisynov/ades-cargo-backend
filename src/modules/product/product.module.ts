import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductScheduler } from '../import-excel/schedule/product-status-schedule';
import { AcceptanceService } from '../acceptance/acceptance.service';
import { PriceEntity } from './price/price.entity';
import { PriceService } from './price/price.service';
import { PriceController } from './price/price.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, PriceEntity])],
  providers: [
    ProductService,
    ProductScheduler,
    AcceptanceService,
    PriceService,
  ],
  controllers: [ProductController, PriceController],
})
export class ProductModule {}
