import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductStatus } from '@/enums/product-status.enum';
import { CreateAcceptanceListDto } from '@/dto/acceptance-list.dto';

@Injectable()
export class AcceptanceService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateAcceptanceListDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const products = dto.items.map((item) => ({
        customer_code: item.customer_code,
        product_code: item.product_code,
        weight_Kg: item.weight_Kg,
        status: ProductStatus.ARRIVED_BISHKEK,
      }));

      await queryRunner.manager.upsert(ProductEntity, products, [
        'customer_code',
        'product_code',
      ]);

      await queryRunner.commitTransaction();

      return {
        count: products.length,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
