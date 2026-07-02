import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
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
      const searchProducts = await queryRunner.manager.find(ProductEntity, {
        where: {
          product_code: In(dto.items.map((item) => item.product_code)),
        },
      });
      const searchProductsSet = new Set(
        searchProducts.map(
          (product) => `${product.product_code}:${product.customer_code}`,
        ),
      );
      const duplicates: string[] = [];
      dto.items.forEach((item) => {
        const code = `${item.product_code}:${item.customer_code}`;
        if (searchProductsSet.has(code)) {
          duplicates.push(code);
        } else {
          searchProductsSet.add(code);
        }
      });
      if (duplicates.length > 0) {
        throw new BadRequestException({
          message: 'Найдены дубликаты данных во втором файле!',
          duplicates: [...new Set(duplicates)],
        });
      }
      const products = dto.items.map((item) => ({
        customer_code: item.customer_code,
        product_code: item.product_code,
        weight_Kg: item.weight_Kg,
        status: ProductStatus.ARRIVED_BISHKEK,
      }));
      if (products.length > 0) {
        await queryRunner.manager.insert(ProductEntity, products);
      }
      await queryRunner.commitTransaction();

      return {
        saved: products.length,
        skipped: dto.items.length - products.length,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
