import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class ImportListDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  slugs: string[];
}
