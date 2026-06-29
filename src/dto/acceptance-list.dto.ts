import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';

import { CreateAcceptanceDto } from './acceptance.dto';

export class CreateAcceptanceListDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAcceptanceDto)
  items!: CreateAcceptanceDto[];
}
