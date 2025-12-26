import { PartialType } from '@nestjs/mapped-types';
import { CreatePekerjaanDto } from './create-pekerjaan.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePekerjaanDto extends PartialType(CreatePekerjaanDto) {
  @ApiPropertyOptional({
    description: 'Nama pekerjaan',
    example: 'Lecturer',
    minLength: 1,
    maxLength: 100,
  })
  namaPekerjaan?: string;
}
