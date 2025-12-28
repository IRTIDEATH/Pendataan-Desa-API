import { IsNotEmpty, IsString, IsUUID, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateWargaDto {
  @ApiProperty({
    description: 'User ID that owns this warga data',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Nomor Induk Kependudukan',
    example: '1234567890123456',
  })
  @IsString()
  @IsNotEmpty()
  nik: string;

  @ApiProperty({
    description: 'Nama lengkap warga',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  namaWarga: string;

  @ApiProperty({
    description: 'Tempat lahir',
    example: 'Jakarta',
  })
  @IsString()
  @IsNotEmpty()
  tempatLahir: string;

  @ApiProperty({
    description: 'Tanggal lahir',
    example: '1997-02-15',
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }: { value: string | Date }) => new Date(value))
  tanggalLahir: Date;

  @ApiProperty({
    description: 'Warga negara ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID('4')
  @IsNotEmpty()
  warganegaraId: string;

  @ApiProperty({
    description: 'Alamat lengkap',
    example: 'Jl. Merdeka No. 123, Jakarta Pusat',
  })
  @IsString()
  @IsNotEmpty()
  alamat: string;

  @ApiProperty({
    description: 'Nama pekerjaan',
    example: 'Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  namaPekerjaan: string;
}
