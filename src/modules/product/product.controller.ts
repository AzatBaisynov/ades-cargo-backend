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
import { AcceptanceService } from '../acceptance/acceptance.service';
import { CreateAcceptanceDto } from '@/dto/acceptance.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly acceptanceService: AcceptanceService,
  ) {}

  @Get('search/:value')
  async getProductsForIssue(@Param('value') value: string) {
    return this.productService.findClientProductForIssue(value);
  }

  @Post('import-china')
  @HttpCode(HttpStatus.OK)
  async importChina(@Body() dto: ImportDTO[]) {
    return await this.productService.saveAndChangeStatus(dto);
  }
  @Post('acceptance')
  @HttpCode(HttpStatus.OK)
  async createAcceptance(@Body() dto: CreateAcceptanceDto) {
    return await this.acceptanceService.create(dto);
  }
  @Patch('status')
  async updateStatus(@Body() dto: UpdateStatusDto) {
    return this.productService.updateStatus(dto);
  }
}
