import { PartialType } from '@nestjs/mapped-types';
import { CreatePekerjaanDto } from './create-pekerjaan.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePekerjaanDto extends PartialType(CreatePekerjaanDto) {
  @ApiProperty({
    description: 'Nama pekerjaan',
    example: 'Lecturer',
    required: false,
  })
  namaPekerjaan?: string;
}
