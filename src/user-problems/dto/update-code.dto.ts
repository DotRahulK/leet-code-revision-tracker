import { IsString } from 'class-validator';

export class UpdateCodeDto {
  @IsString()
  code: string;
}
