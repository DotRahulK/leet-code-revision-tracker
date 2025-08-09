import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateRecallDto {
  @IsInt()
  @Min(0)
  @Max(5)
  @ApiProperty({
    description: 'Recall quality rating (0-5)',
    minimum: 0,
    maximum: 5,
  })
  quality: number;
}
