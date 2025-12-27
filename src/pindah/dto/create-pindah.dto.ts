import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePindahDto {
  @ApiProperty({
    description: 'Jenis pindah',
    example: 'Datang',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  jenisPindah: string;
}
