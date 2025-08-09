import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'Unique username' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Email address' })
  email?: string;
}
