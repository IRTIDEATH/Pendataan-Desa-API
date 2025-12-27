import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePindahDto {
  @ApiProperty({
    description: 'Jenis pindah',
    example: 'Keluar',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  jenisPindah?: string;
}
