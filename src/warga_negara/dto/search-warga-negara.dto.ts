import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchWargaNegaraDto {
  @ApiPropertyOptional({
    description: 'Search query for jenis kebangsaan',
    example: 'WNI',
  })
  @IsString()
  @IsOptional()
  q: string;

  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  current_page: number = 1;

  @ApiPropertyOptional({
    description: 'Page size (default: 10)',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size: number = 10;
}
