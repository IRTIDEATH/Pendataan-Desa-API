import { Module } from '@nestjs/common';
import { WargaNegaraService } from './warga-negara.service';
import { WargaNegaraController } from './warga-negara.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WargaNegaraController],
  providers: [WargaNegaraService],
})
export class WargaNegaraModule {}
