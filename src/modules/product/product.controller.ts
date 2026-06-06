import { Controller, Body, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { ImportDTO } from '@/dto/import.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('import-china')
  @HttpCode(HttpStatus.OK)
  async importChina(@Body() dto: ImportDTO[]) {
    return await this.productService.saveAndChangeStatus(dto);
  }
}
