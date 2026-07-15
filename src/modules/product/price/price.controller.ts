import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PriceService } from './price.service';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { SetPriceDto } from '@/dto/set-price.dto';

@UseGuards(JwtAuthGuard)
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post('set')
  setPrice(@Body() dto: SetPriceDto) {
    return this.priceService.setPrice(dto);
  }

  @Get('current')
  getCurrentPrice() {
    return this.priceService.getCurrentPrice();
  }

  @Get('history')
  getPriceHistory() {
    return this.priceService.getPriceHistory();
  }
}
