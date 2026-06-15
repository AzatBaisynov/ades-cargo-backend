// В файле update-status.dto.ts
import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ProductStatus } from '../enums/product-status.enum';

export class UpdateStatusDto {
  @IsArray({ message: 'productIds должен быть массивом' })
  @IsUUID('all', { each: true, message: 'Каждый ID должен быть валидным UUID' })
  @IsNotEmpty({ message: 'Список ID не должен быть пустым' })
  product_code!: string[];

  @IsEnum(ProductStatus, { message: 'Неверный статус товара' })
  @IsNotEmpty({ message: 'Статус обязателен' })
  status!: ProductStatus;
}
