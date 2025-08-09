import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpsertProblemDto } from './upsert-problem.dto';

export class BulkImportProblemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertProblemDto)
  @ApiProperty({ type: [UpsertProblemDto] })
  items: UpsertProblemDto[];
}
