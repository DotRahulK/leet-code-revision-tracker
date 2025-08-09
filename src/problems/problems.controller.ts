import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';
import { GetProblemsQueryDto } from './dto/get-problems-query.dto';
import { UpsertProblemDto } from './dto/upsert-problem.dto';
import { BulkImportProblemsDto } from './dto/bulk-import-problems.dto';

@ApiTags('problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    enum: ['Easy', 'Medium', 'Hard'],
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getProblems(@Query() query: GetProblemsQueryDto) {
    return this.problemsService.findAll(query);
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', description: 'Problem slug' })
  async getBySlug(@Param('slug') slug: string) {
    const problem = await this.problemsService.findBySlug(slug);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }
    return problem;
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BulkImportProblemsDto })
  async bulkImport(@Body() body: BulkImportProblemsDto) {
    return this.problemsService.bulkImportFromJson(body.items);
  }

  @Put(':slug')
  @ApiParam({ name: 'slug', description: 'Problem slug' })
  @ApiBody({ type: UpsertProblemDto })
  async upsertProblem(
    @Param('slug') slug: string,
    @Body() dto: UpsertProblemDto,
  ) {
    if (slug !== dto.slug) {
      throw new BadRequestException('Slug mismatch');
    }
    return this.problemsService.createOrUpdateFromLcMeta(dto);
  }
}
