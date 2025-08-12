import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ScheduledItemsService } from './scheduled-items.service';
import { ScheduleListDto } from './dto/schedule-list.dto';

@Controller('lists/custom')
export class CustomListSchedulingController {
  constructor(private readonly service: ScheduledItemsService) {}

  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body() dto: ScheduleListDto) {
    return this.service.scheduleList(id, dto);
  }

  @Delete(':id/schedule')
  unschedule(@Param('id') id: string) {
    return this.service.unscheduleList(id);
  }
}
