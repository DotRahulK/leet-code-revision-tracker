import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsISO8601, IsInt, Min, Max } from 'class-validator';
import { ScheduledItemType } from '../scheduled-item.entity';

export class GetScheduledQueryDto {
  @ApiPropertyOptional({ enum: ['ALL', 'NEXT_UP', 'REVISION'], example: 'ALL' })
  @IsOptional()
  @IsEnum(['ALL', 'NEXT_UP', 'REVISION'])
  type?: 'ALL' | ScheduledItemType;

  @ApiPropertyOptional({ enum: ['PLANNED', 'DONE', 'CANCELLED'], example: 'PLANNED' })
  @IsOptional()
  @IsEnum(['PLANNED', 'DONE', 'CANCELLED'])
  status?: 'PLANNED' | 'DONE' | 'CANCELLED';

  @ApiPropertyOptional({ description: 'Start date (inclusive) in ISO-8601 (yyyy-mm-dd or full ISO)' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: 'End date (inclusive) in ISO-8601' })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({ description: 'Page (1-based)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 25 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
