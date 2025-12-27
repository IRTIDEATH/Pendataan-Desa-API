import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkDeleteWargaDto {
  @ApiProperty({
    description: 'Array of warga IDs to delete',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    isArray: true,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  ids: string[];
}
