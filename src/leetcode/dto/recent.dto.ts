import { IsInt, IsOptional, Min } from 'class-validator';

export class RecentDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
