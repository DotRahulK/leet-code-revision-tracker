import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpsertProblemDto } from './upsert-problem.dto';

export class BulkImportProblemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertProblemDto)
  items: UpsertProblemDto[];
}
