/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SyncDto {
  @ApiPropertyOptional({
    description: 'LeetCode username to sync',
    example: 'myUser',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Number of recent submissions to fetch',
    example: 20,
  })
  limit?: number;
}
