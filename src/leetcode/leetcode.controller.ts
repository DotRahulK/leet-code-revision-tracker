/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LeetcodeService } from './leetcode.service';
import { SyncDto } from './dto/sync.dto';
import { RecentDto } from './dto/recent.dto';

@ApiTags('leetcode')
@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly service: LeetcodeService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync recent accepted submissions from LeetCode' })
  async sync(@Body() body: SyncDto) {
    return this.service.syncRecentAccepted(body);
  }

  @Get('recent')
  @ApiOperation({
    summary: 'Preview recent accepted submissions without upserting',
  })
  async recent(@Query() query: RecentDto) {
    return this.service.getRecentAccepted(
      process.env.LC_USERNAME || '',
      query.limit,
    );
  }

  @Get('question/:slug')
  @ApiOperation({ summary: 'Fetch question detail from LeetCode' })
  async question(@Param('slug') slug: string) {
    return this.service.getQuestionDetail(slug);
  }
}
