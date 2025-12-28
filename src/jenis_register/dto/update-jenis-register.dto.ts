import { PartialType } from '@nestjs/mapped-types';
import { CreateJenisRegisterDto } from './create-jenis-register.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJenisRegisterDto extends PartialType(
  CreateJenisRegisterDto,
) {
  @ApiProperty({
    description: 'Jenis register',
    example: 'Kelahiran',
    required: false,
  })
  jenisRegister?: string;
}
