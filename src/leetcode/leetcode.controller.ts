import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeetcodeService } from './leetcode.service';
import { SyncDto } from './dto/sync.dto';
import { RecentDto } from './dto/recent.dto';

@ApiTags('leetcode')
@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly service: LeetcodeService) {}

  @Post('sync')
  @ApiBody({ type: SyncDto })
  sync(@Body() dto: SyncDto) {
    return this.service.syncRecentAccepted(dto);
  }

  @Get('recent')
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of recent submissions to fetch',
  })
  recent(@Query() query: RecentDto) {
    return this.service.getRecentAccepted(
      this.service.getDefaultUsername(),
      query.limit ?? this.service.getDefaultPageSize(),
    );
  }

  @Get('question/:slug')
  @ApiParam({ name: 'slug', description: 'LeetCode problem slug' })
  question(@Param('slug') slug: string) {
    return this.service.getQuestionDetail(slug);
  }
}
