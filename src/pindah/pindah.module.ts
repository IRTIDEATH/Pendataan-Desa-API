import { Module } from '@nestjs/common';
import { PindahService } from './pindah.service';
import { PindahController } from './pindah.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PindahController],
  providers: [PindahService],
  exports: [PindahService],
})
export class PindahModule {}
