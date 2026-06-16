/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class CreateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название товара не может быть пустым!' })
  customer_code!: string;
  @IsEnum(ProductStatus, {
    message:
      'Статус должен быть одним из следующих значений: PENDING, IN_CHINA, IN_TRANSIT, ARRIVED_BISHKEK, ISSUED',
  })
  status?: ProductStatus;
}
