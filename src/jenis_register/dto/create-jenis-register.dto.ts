import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJenisRegisterDto {
  @ApiProperty({
    description: 'Jenis register',
    example: 'Pernikahan',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  jenisRegister: string;
}
