import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWargaNegaraDto {
  @ApiProperty({
    description: 'Jenis kebangsaan',
    example: 'WNI',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  jenisKebangsaan: string;
}
