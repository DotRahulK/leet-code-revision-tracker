import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class MarkDoneDto {
  @ApiProperty({ required: false, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  ratedQuality?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  solutionCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  timeTakenMinutes?: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  referencesUsed?: boolean;
}
