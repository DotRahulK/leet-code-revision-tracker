import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ScheduledItemsService } from './scheduled-items.service';
import { MarkDoneDto } from './dto/mark-done.dto';
import { GetScheduledQueryDto } from './dto/get-scheduled.query';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('scheduled')
export class ScheduledItemsController {
  constructor(private readonly service: ScheduledItemsService) {}

  @Get()
  @ApiOkResponse({ description: 'List scheduled items' })
  findAll(@Query() q: GetScheduledQueryDto) {
    const from = q.from ? new Date(q.from) : undefined;
    const to = q.to ? new Date(q.to) : undefined;
    return this.service.findAll(q.type, q.status ?? 'PLANNED', from, to, q.page ?? 1, q.pageSize ?? 25);
  }

  @Post('problem/:id')
  @ApiCreatedResponse({ description: 'Scheduled problem' })
  scheduleProblem(@Param('id') id: string) {
    return this.service.scheduleProblem(id);
  }

  @Post(':id/done')
  @ApiOkResponse({ description: 'Marked as done and logged completion' })
  markDone(@Param('id') id: string, @Body() dto: MarkDoneDto) {
    return this.service.markDone(id, dto);
  }
}
