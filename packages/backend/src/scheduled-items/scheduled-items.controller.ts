import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScheduledItemsService } from './scheduled-items.service';
import { MarkDoneDto } from './dto/mark-done.dto';

@Controller('scheduled')
export class ScheduledItemsController {
  constructor(private readonly service: ScheduledItemsService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.service.findAll(type);
  }

  @Post(':id/done')
  markDone(@Param('id') id: string, @Body() dto: MarkDoneDto) {
    return this.service.markDone(id, dto);
  }
}
