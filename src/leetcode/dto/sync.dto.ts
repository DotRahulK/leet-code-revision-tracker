import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SyncDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'LeetCode username to sync' })
  username?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Maximum number of submissions to sync',
    minimum: 1,
  })
  limit?: number;
}
