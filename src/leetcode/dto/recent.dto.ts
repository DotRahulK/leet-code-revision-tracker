/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RecentDto {
  @ApiPropertyOptional({
    description: 'Number of recent submissions to fetch',
    example: 20,
  })
  limit?: number;
}
