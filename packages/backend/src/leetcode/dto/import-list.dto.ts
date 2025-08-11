import { IsString } from 'class-validator';

export class ImportListDto {
  @IsString()
  list: string;
}

