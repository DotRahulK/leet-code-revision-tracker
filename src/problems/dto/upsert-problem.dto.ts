import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertProblemDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty: 'Easy' | 'Medium' | 'Hard';

  @Transform(({ value }) => value ?? [])
  @IsArray()
  @IsString({ each: true })
  tags: string[] = [];

  @IsOptional()
  @IsString()
  description?: string;
}
