import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class BulkDeletePekerjaanDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @Transform(({ value }: { value: string[] | string }) => {
    if (Array.isArray(value)) {
      return value;
    }
    return typeof value === 'string' ? [value] : [];
  })
  ids: string[];
}
