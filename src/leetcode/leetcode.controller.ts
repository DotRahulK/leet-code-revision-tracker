import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { SyncDto } from './dto/sync.dto';
import { RecentDto } from './dto/recent.dto';

@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly service: LeetcodeService) {}

  @Post('sync')
  sync(@Body() dto: SyncDto) {
    return this.service.syncRecentAccepted(dto);
  }

  @Get('recent')
  recent(@Query() query: RecentDto) {
    return this.service.getRecentAccepted(
      this.service.getDefaultUsername(),
      query.limit ?? this.service.getDefaultPageSize(),
    );
  }

  @Get('question/:slug')
  question(@Param('slug') slug: string) {
    return this.service.getQuestionDetail(slug);
  }
}
