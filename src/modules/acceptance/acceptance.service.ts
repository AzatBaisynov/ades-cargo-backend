import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acceptance } from './entities/acceptance.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateAcceptanceDto } from '../../dto/acceptance.dto';
import { ProductStatus } from '@/enums/product-status.enum';

@Injectable()
export class AcceptanceService {
  constructor(
    @InjectRepository(Acceptance)
    private readonly acceptanceRepository: Repository<Acceptance>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateAcceptanceDto) {
    const product = await this.productRepository.findOne({
      where: {
        product_code: dto.product_code,
        customer_code: dto.customer_code,
      },
    });

    if (!product) {
      throw new BadRequestException(
        `Товар с кодом ${dto.product_code} для клиента ${dto.customer_code} не найден`,
      );
    }
    product.status = ProductStatus.ARRIVED_BISHKEK;
    await this.productRepository.save(product);

    const acceptance = this.acceptanceRepository.create({
      customer_code: dto.customer_code,
      product_code: dto.product_code,
      weight_Kg: dto.weight_kg,
    });
    return await this.acceptanceRepository.save(acceptance);
  }
}
