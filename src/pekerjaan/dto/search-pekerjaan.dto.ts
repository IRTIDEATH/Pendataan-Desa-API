import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchPekerjaanDto {
  @IsString()
  @IsOptional()
  q: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  current_page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size: number = 10;
}
