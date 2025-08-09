import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCodeDto {
  @IsString()
  @ApiProperty({ description: 'Latest accepted solution code' })
  code: string;
}
