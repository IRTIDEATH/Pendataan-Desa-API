import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePekerjaanDto {
  @ApiProperty({
    description: 'Nama pekerjaan',
    example: 'Teacher',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  namaPekerjaan: string;
}
