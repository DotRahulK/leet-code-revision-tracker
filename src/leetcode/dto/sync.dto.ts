import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SyncDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
