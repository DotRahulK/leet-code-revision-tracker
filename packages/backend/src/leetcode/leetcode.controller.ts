import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeetcodeService } from './leetcode.service';
import { SyncDto } from './dto/sync.dto';
import { RecentDto } from './dto/recent.dto';
import { ImportListDto } from './dto/import-list.dto';

@ApiTags('leetcode')
@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly service: LeetcodeService) {}

  // Body is optional; defaults are sourced from environment config
  @Post('sync')
  @ApiBody({ type: SyncDto, required: false })
  sync(@Body() dto: SyncDto = {} as SyncDto) {
    return this.service.syncRecentAccepted(dto ?? {});
  }

  @Post('list')
  @ApiBody({ type: ImportListDto })
  importList(@Body() dto: ImportListDto) {
    return this.service.importLeetcodeList(dto.list);
  }

  @Get('list/meta')
  @ApiQuery({ name: 'list', description: 'LeetCode list URL or slug' })
  listMeta(@Query('list') list: string) {
    return this.service.getLeetcodeListMeta(list);
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
