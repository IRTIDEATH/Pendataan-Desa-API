import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWargaDto {
  @ApiProperty({
    description: 'Search query for nama warga, NIK, or alamat',
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
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  current_page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  size?: number = 10;
}
