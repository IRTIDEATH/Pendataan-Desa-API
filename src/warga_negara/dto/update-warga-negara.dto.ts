import { PartialType } from '@nestjs/mapped-types';
import { CreateWargaNegaraDto } from './create-warga-negara.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWargaNegaraDto extends PartialType(CreateWargaNegaraDto) {
  @ApiProperty({
    description: 'Jenis kebangsaan',
    example: 'WNA',
    required: false,
  })
  jenisKebangsaan?: string;
}
