import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkProblemDto {
  @IsString()
  @ApiProperty({ description: 'Problem identifier' })
  problemId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User identifier', required: false })
  userId?: string;
}
