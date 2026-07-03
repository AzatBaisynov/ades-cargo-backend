import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const seen = new Set<string>();
    const fileDuplicates: string[] = [];
    const productsToSave: ProductEntity[] = [];
    for (const item of data) {
      const customer_code = item.customer_code.trim().toUpperCase();
      const product_code = item.product_code.trim().toUpperCase();
      const key = `${customer_code}:${product_code}`;
      if (seen.has(key)) {
        fileDuplicates.push(key);
        continue;
      }
      seen.add(key);
      const product = new ProductEntity();
      product.product_code = product_code;
      product.customer_code = customer_code;
      product.status = ProductStatus.IN_CHINA;
      productsToSave.push(product);
    }
    if (productsToSave.length > 0) {
      await this.productRepository.upsert(productsToSave, [
        'product_code',
        'customer_code',
      ]);
    }

    return {
      success: true,
      message: `Успешно импортировано товаров: ${productsToSave.length}`,
      duplicates: [...new Set(fileDuplicates)],
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
    const productsToSave = findproducts.map((product) => {
      product.status = status;
      if (status === ProductStatus.ISSUED) {
        // TODO:   const calculatedPrice = Number(product.weight) * Number(product.tariff);
        // product. = calculatedPrice;
      }
      return product;
    });
    await this.productRepository.upsert(productsToSave, [
      'product_code',
      'customer_code',
    ]);
    return {
      success: true,
      message: `Статус успешно обновлен для ${product_code.length} товаров.`,
    };
  }

  async findClientProductForIssue(searchValue: string) {
    if (!searchValue) {
      throw new BadRequestException(
        'Товары не найдены. Введите код клиента для поиска.',
      );
    }
    const cleanSearch = searchValue.trim().toUpperCase();
    const products = await this.productRepository.find({
      where: [
        { customer_code: cleanSearch, status: ProductStatus.ARRIVED_BISHKEK },
        { product_code: cleanSearch, status: ProductStatus.ARRIVED_BISHKEK },
      ],
      order: {
        status: 'DESC',
        createdAt: 'DESC',
      },
    });
    if (products.length > 0) {
      return products;
    }
    const anyProductExist = await this.productRepository.findOne({
      where: [{ customer_code: cleanSearch }, { product_code: cleanSearch }],
    });
    if (anyProductExist) {
      throw new BadRequestException(
        `Товары найдены, но они не готовы к выдаче. Текущий статус: ${anyProductExist?.status}`,
      );
    }
    throw new NotFoundException(
      `Товары с кодом "${cleanSearch}" не найден на складе.`,
    );
  }
}
