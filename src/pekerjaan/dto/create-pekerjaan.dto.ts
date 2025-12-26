import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePekerjaanDto {
  @ApiProperty({
    description: 'Nama pekerjaan',
    example: 'Teacher',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  namaPekerjaan: string;
}
