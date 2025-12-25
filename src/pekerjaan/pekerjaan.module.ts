import { Module } from '@nestjs/common';
import { PekerjaanService } from './pekerjaan.service';
import { PekerjaanController } from './pekerjaan.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PekerjaanController],
  providers: [PekerjaanService],
})
export class PekerjaanModule {}
