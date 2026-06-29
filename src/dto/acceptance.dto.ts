import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateAcceptanceDto {
  @IsString()
  @IsNotEmpty({ message: 'код клиента не должен быть пустым' })
  customer_code!: string;

  @IsString()
  @IsNotEmpty({ message: 'код продукта не должен быть пустым' })
  product_code!: string;
  @IsOptional()
  @IsNumber({}, { message: 'вес должен быть числом' })
  @IsPositive({ message: 'вес должен быть положительным числом' })
  weight_Kg?: number;
}
export class CreateAcceptanceListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAcceptanceDto)
  items!: CreateAcceptanceDto[];
}
