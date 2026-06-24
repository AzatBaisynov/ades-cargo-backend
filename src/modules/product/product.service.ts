import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductStatus } from '@/enums/product-status.enum';
import { ImportDTO } from '@/dto/import.dto';
import { UpdateStatusDto } from '@/dto/product-update.dto';

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
      product.product_code = item.product_code.toUpperCase();
      product.customer_code = item.customer_code.toUpperCase();
      product.status = ProductStatus.IN_CHINA;
      return product;
    });
    const savedProducts = await this.productRepository.save(productsToSave);

    return {
      success: true,
      message: `Успешно импортировано товаров: ${savedProducts.length}`,
    };
  }

  async updateStatus(dto: UpdateStatusDto) {
    const { product_code, status } = dto;
    const findproducts = await this.productRepository.find({
      where: { id: In(product_code) },
    });
    if (findproducts.length !== product_code.length) {
      throw new NotFoundException(
        'Один или несколько товаров не найдены в базе данных',
      );
    }
    await this.productRepository.update(
      { id: In(product_code) },
      { status: status },
    );
    return {
      success: true,
      message: `Статус успешно обновлен для ${product_code.length} товаров.`,
    };
  }

  async findClientProductForIssue(searchValue: string) {
    if (!searchValue) {
      return [];
    }
    return await this.productRepository.find({
      where: [
        { customer_code: searchValue, status: ProductStatus.ARRIVED_BISHKEK },
        { product_code: searchValue, status: ProductStatus.ARRIVED_BISHKEK },
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
