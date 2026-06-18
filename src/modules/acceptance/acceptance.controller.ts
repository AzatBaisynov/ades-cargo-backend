import { Body, Controller, Post } from '@nestjs/common';

import { AcceptanceService } from './acceptance.service';
import { CreateAcceptanceDto } from '../../dto/acceptance.dto';

@Controller('acceptance')
export class AcceptanceController {
  constructor(private readonly acceptanceService: AcceptanceService) {}

  @Post()
  async create(@Body() dto: CreateAcceptanceDto) {
    return this.acceptanceService.create(dto);
  }
}
