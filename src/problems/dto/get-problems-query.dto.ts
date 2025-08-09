import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProblemsQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search term for problem title or slug' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by tag' })
  tag?: string;

  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  @ApiPropertyOptional({
    enum: ['Easy', 'Medium', 'Hard'],
    description: 'Filter by difficulty',
  })
  difficulty?: 'Easy' | 'Medium' | 'Hard';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Maximum number of problems to return',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  limit: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Number of problems to skip',
    minimum: 0,
    default: 0,
  })
  offset: number = 0;
}
