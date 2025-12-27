import { PartialType } from '@nestjs/mapped-types';
import { CreateWargaNegaraDto } from './create-warga-negara.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWargaNegaraDto extends PartialType(CreateWargaNegaraDto) {
  @ApiPropertyOptional({
    description: 'Jenis kebangsaan',
    example: 'WNA',
    minLength: 1,
    maxLength: 100,
  })
  jenisKebangsaan?: string;
}
