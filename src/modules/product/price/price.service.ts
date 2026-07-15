import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from './price.entity';
import { SetPriceDto } from '@/dto/set-price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
  ) {}

  async getCurrentPrice(): Promise<PriceEntity> {
    const price = await this.priceRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
    if (!price) {
      throw new NotFoundException('Цена не установлена');
    }
    return price[0];
  }

  async setPrice(dto: SetPriceDto): Promise<PriceEntity> {
    const price = this.priceRepository.create({
      current_price: dto.current_price,
    });
    return this.priceRepository.save(price);
  }
  async getPriceHistory(): Promise<PriceEntity[]> {
    return this.priceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
