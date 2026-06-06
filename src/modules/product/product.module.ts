import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
