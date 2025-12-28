import { IsString, IsUUID, IsDate, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateWargaDto {
  @ApiProperty({
    description: 'NIK',
    example: '3171011502970001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(16, 16)
  nik?: string;

  @ApiProperty({
    description: 'Nama lengkap warga',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  namaWarga?: string;

  @ApiProperty({
    description: 'Tempat lahir',
    example: 'Jakarta',
    required: false,
  })
  @IsString()
  @IsOptional()
  tempatLahir?: string;

  @ApiProperty({
    description: 'Tanggal lahir',
    example: '1997-02-15',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string | Date }) =>
    value ? new Date(value) : undefined,
  )
  tanggalLahir?: Date;

  @ApiProperty({
    description: 'Warga negara ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  warganegaraId?: string;

  @ApiProperty({
    description: 'Alamat lengkap',
    example: 'Jl. Merdeka No. 123, Jakarta Pusat',
    required: false,
  })
  @IsString()
  @IsOptional()
  alamat?: string;

  @ApiProperty({
    description: 'Pekerjaan ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  pekerjaanId?: string;
}
