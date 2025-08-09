import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertProblemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Unique problem slug' })
  slug: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Problem title' })
  title: string;

  @IsIn(['Easy', 'Medium', 'Hard'])
  @ApiProperty({
    enum: ['Easy', 'Medium', 'Hard'],
    description: 'Problem difficulty',
  })
  difficulty: 'Easy' | 'Medium' | 'Hard';

  @Transform(({ value }) => value ?? [])
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Associated tags', type: [String], default: [] })
  tags: string[] = [];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Problem description in Markdown' })
  description?: string;
}
