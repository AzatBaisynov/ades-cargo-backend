import { IsNumber, IsPositive } from 'class-validator';

export class SetPriceDto {
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsPositive({ message: 'Цена должна быть положительной' })
  current_price!: number;
}
