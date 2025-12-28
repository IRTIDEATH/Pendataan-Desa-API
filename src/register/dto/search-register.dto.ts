import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchRegisterDto {
  @ApiProperty({
    description: 'Search query for keperluan, warga name, or jenis register',
    required: false,
  })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current_page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}
