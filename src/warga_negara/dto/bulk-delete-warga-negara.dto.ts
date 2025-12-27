import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BulkDeleteWargaNegaraDto {
  @ApiProperty({
    description: 'Array of warga negara IDs to delete',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    isArray: true,
    minItems: 1,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @Transform(({ value }: { value: string[] | string }) => {
    if (Array.isArray(value)) {
      return value;
    }
    return typeof value === 'string' ? [value] : [];
  })
  ids: string[];
}
