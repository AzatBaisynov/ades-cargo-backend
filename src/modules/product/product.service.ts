import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductStatus } from '@/enums/product-status.enum';
import { ImportDTO } from '@/dto/import.dto';
import { UpdateStatusDto } from '@/dto/product-update.dto';
import Decimal from 'decimal.js';
import { PriceService } from './price/price.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly priceService: PriceService,
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
    const { product_code } = dto;

    const findProducts = await this.productRepository.find({
      where: { id: In(product_code) },
    });

    if (findProducts.length !== product_code.length) {
      throw new NotFoundException(
        'Один или несколько товаров не найдены в базе данных',
      );
    }

    const currentPrice = await this.priceService.getCurrentPrice();
    const productsToSave: ProductEntity[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const product of findProducts) {
      if (!product.weight_Kg) {
        failed.push({ id: product.id, reason: 'Вес не указан' });
        continue;
      }

      const total = new Decimal(product.weight_Kg)
        .mul(new Decimal(currentPrice.current_price))
        .toDecimalPlaces(2)
        .toNumber();

      product.current_price = currentPrice.current_price;
      product.total_price = total;
      product.status = ProductStatus.ISSUED;
      productsToSave.push(product);
    }

    const saved =
      productsToSave.length > 0
        ? await this.productRepository.save(productsToSave)
        : [];

    return {
      success: true,
      issued: saved.length,
      failed,
      message: `Выдано: ${saved.length}, с ошибками: ${failed.length}`,
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
    if (products.length === 0) {
      const anyProductExist = await this.productRepository.findOne({
        where: [{ customer_code: cleanSearch }, { product_code: cleanSearch }],
      });
      if (!anyProductExist) {
        throw new NotFoundException(
          `Товары с кодом "${cleanSearch}" не найден на складе.`,
        );
      }
      if (anyProductExist?.status === ProductStatus.ISSUED) {
        throw new BadRequestException('Товар уже выдан');
      }
      throw new BadRequestException(
        `Товары найдены, но они не готовы к выдаче. Текущий статус: ${anyProductExist?.status}`,
      );
    }
    const currentPrice = await this.priceService.getCurrentPrice();

    let clientTotalPrice = new Decimal(0);

    const productsWithPrice = products.map((product) => {
      const total_price = product.weight_Kg
        ? new Decimal(product.weight_Kg)
            .mul(new Decimal(currentPrice.current_price))
            .toDecimalPlaces(2)
            .toNumber()
        : 0;

      clientTotalPrice = clientTotalPrice.plus(total_price);

      return {
        ...product,
        current_price: currentPrice.current_price,
        total_price,
      };
    });

    return {
      products: productsWithPrice,
      client_total_price: clientTotalPrice.toDecimalPlaces(2).toNumber(),
    };
  }
}
