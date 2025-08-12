import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';

export enum ScheduleSpacing {
  DAILY = 'DAILY',
  ALT_DAYS = 'ALT_DAYS',
  WEEKLY = 'WEEKLY',
  ALL_TODAY = 'ALL_TODAY',
}

export class ScheduleListDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiProperty({ required: false, enum: ScheduleSpacing })
  @IsOptional()
  @IsEnum(ScheduleSpacing)
  spacing?: ScheduleSpacing;
}
