import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegisterDto {
  @ApiProperty({
    description: 'User ID that owns this register data',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Warga ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID('4')
  @IsNotEmpty()
  wargaId: string;

  @ApiProperty({
    description: 'Pindah ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID('4')
  @IsNotEmpty()
  pindahId: string;

  @ApiProperty({
    description: 'Jenis Register ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID('4')
  @IsNotEmpty()
  jenisRegisterId: string;

  @ApiProperty({
    description: 'Keperluan register',
    example: 'Pengurusan KTP',
  })
  @IsString()
  @IsNotEmpty()
  keperluan: string;
}
