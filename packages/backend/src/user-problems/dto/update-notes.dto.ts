import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotesDto {
  @IsString()
  @ApiProperty({ description: 'Free-form notes about the problem' })
  notes: string;
}
