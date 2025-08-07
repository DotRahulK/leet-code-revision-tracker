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
import { ProblemsService } from './problems.service';
import { GetProblemsQueryDto } from './dto/get-problems-query.dto';
import { UpsertProblemDto } from './dto/upsert-problem.dto';
import { BulkImportProblemsDto } from './dto/bulk-import-problems.dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async getProblems(@Query() query: GetProblemsQueryDto) {
    return this.problemsService.findAll(query);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const problem = await this.problemsService.findBySlug(slug);
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }
    return problem;
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async bulkImport(@Body() body: BulkImportProblemsDto) {
    return this.problemsService.bulkImportFromJson(body.items);
  }

  @Put(':slug')
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
