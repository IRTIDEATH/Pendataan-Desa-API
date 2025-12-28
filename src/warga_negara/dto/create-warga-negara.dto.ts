import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWargaNegaraDto {
  @ApiProperty({
    description: 'Jenis kebangsaan',
    example: 'WNI',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  jenisKebangsaan: string;
}
