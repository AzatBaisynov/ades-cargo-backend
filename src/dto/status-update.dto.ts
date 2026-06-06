import { ProductStatus } from '@/enums/product-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'Статус не должен быть пустым' })
  @IsEnum(ProductStatus, { message: 'Передан некорректный статус товара' })
  status?: ProductStatus;
}
