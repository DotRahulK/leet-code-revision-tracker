import { IsInt, Min, Max } from 'class-validator';

export class RateRecallDto {
  @IsInt()
  @Min(0)
  @Max(5)
  quality: number;
}
