import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ImportDTO } from '@/dto/import.dto';
import { ProductStatus } from '@/enums/product-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async saveAndChangeStatus(data: ImportDTO[]) {
    if (!data || data.length === 0) {
      return { success: true, message: 'Массив данных пуст' };
    }
    const productsToSave = data.map((item) => {
      const product = new ProductEntity();
      product.product_code = item.product_code;
      product.customer_code = item.customer_code;
      product.status = ProductStatus.IN_CHINA;
      return product;
    });
    const savedProducts = await this.productRepository.save(productsToSave);

    return {
      success: true,
      message: `Успешно импортировано товаров: ${savedProducts.length}`,
    };
  }
}
