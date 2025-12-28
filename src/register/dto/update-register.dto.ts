import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegisterDto {
  @ApiProperty({
    description: 'Warga ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  wargaId?: string;

  @ApiProperty({
    description: 'Pindah ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  pindahId?: string;

  @ApiProperty({
    description: 'Jenis Register ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  jenisRegisterId?: string;

  @ApiProperty({
    description: 'Keperluan register',
    example: 'Pengurusan KTP',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  keperluan?: string;
}
