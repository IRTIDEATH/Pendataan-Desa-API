import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePindahDto {
  @ApiProperty({
    description: 'Jenis pindah',
    example: 'Datang',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  jenisPindah: string;
}
