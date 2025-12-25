import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePekerjaanDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  namaPekerjaan: string;
}
