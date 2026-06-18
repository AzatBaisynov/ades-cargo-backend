import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Get,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ImportDTO } from '@/dto/import.dto';
import { UpdateStatusDto } from '@/dto/product-update.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search/:value')
  async getProductsForIssue(@Param('value') value: string) {
    return this.productService.findClientProductForIssue(value);
  }

  @Post('import-china')
  @HttpCode(HttpStatus.OK)
  async importChina(@Body() dto: ImportDTO[]) {
    return await this.productService.saveAndChangeStatus(dto);
  }
  @Patch('status')
  async updateStatus(@Body() dto: UpdateStatusDto) {
    return this.productService.updateStatus(dto);
  }
}
