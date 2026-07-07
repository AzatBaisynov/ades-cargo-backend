import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

const normalizeCode = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreateAcceptanceDto {
  @Transform(normalizeCode)
  @IsString()
  @IsNotEmpty({ message: 'код клиента не должен быть пустым' })
  customer_code!: string;

  @Transform(normalizeCode)
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
