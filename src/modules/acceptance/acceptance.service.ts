import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateAcceptanceDto } from '../../dto/acceptance.dto';
import { ProductStatus } from '@/enums/product-status.enum';

@Injectable()
export class AcceptanceService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateAcceptanceDto) {
    let product = await this.productRepository.findOne({
      where: {
        product_code: dto.product_code,
        customer_code: dto.customer_code,
      },
    });

    if (!product) {
      product = this.productRepository.create({
        customer_code: dto.customer_code,
        product_code: dto.product_code,
        weight_Kg: dto.weight_kg,
      });
      await this.productRepository.save(product);
    }
    product.status = ProductStatus.ARRIVED_BISHKEK;
    await this.productRepository.save(product);

    const acceptance = this.productRepository.create({
      customer_code: dto.customer_code,
      product_code: dto.product_code,
      weight_Kg: dto.weight_kg,
    });
    return await this.productRepository.save(acceptance);
  }
}
