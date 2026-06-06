import { Controller, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from '@/dto/product-update.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }
}
