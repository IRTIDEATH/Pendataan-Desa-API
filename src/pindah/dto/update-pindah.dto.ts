import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePindahDto } from './create-pindah.dto';

export class UpdatePindahDto extends PartialType(CreatePindahDto) {
  @ApiProperty({
    description: 'Jenis pindah',
    example: 'Keluar',
    required: false,
  })
  jenisPindah?: string;
}
