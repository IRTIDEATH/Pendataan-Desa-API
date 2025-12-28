import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWargaNegaraDto {
  @ApiProperty({
    description: 'Search query for jenis kebangsaan',
    required: false,
  })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  current_page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size?: number = 10;
}
