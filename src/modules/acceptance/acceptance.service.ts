import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductStatus } from '@/enums/product-status.enum';
import { CreateAcceptanceListDto } from '@/dto/acceptance-list.dto';

@Injectable()
export class AcceptanceService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateAcceptanceListDto) {
    const savedProducts: ProductEntity[] = [];
    for (const item of dto.items) {
      let product = await this.productRepository.findOne({
        where: {
          product_code: item.product_code,
          customer_code: item.customer_code,
        },
      });
      if (!product) {
        product = this.productRepository.create({
          customer_code: item.customer_code,
          product_code: item.product_code,
          weight_Kg: item.weight_Kg,
          status: ProductStatus.ARRIVED_BISHKEK,
        });
      } else {
        product.weight_Kg = item.weight_Kg ?? product.weight_Kg;
        product.status = ProductStatus.ARRIVED_BISHKEK;
      }
      const savedProduct = await this.productRepository.save(product);
      savedProducts.push(savedProduct);
    }
    return savedProducts;
  }
}
