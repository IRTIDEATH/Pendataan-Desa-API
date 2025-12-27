import { Module } from '@nestjs/common';
import { WargaService } from './warga.service';
import { WargaController } from './warga.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WargaController],
  providers: [WargaService],
})
export class WargaModule {}
