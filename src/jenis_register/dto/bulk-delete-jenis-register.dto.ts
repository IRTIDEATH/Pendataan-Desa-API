import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkDeleteJenisRegisterDto {
  @ApiProperty({
    description: 'Array of jenis register IDs to delete',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  ids: string[];
}
