import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAcceptanceDto {
  @IsString()
  @IsNotEmpty({ message: 'код клиента не должен быть пустым' })
  customer_code!: string;

  @IsString()
  @IsNotEmpty({ message: 'код продукта не должен быть пустым' })
  product_code!: string;

  @IsNumber()
  @IsPositive({ message: 'вес должен быть числом' })
  weight_kg!: number;
}
