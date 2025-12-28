import { Module } from '@nestjs/common';
import { JenisRegisterService } from './jenis-register.service';
import { JenisRegisterController } from './jenis-register.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JenisRegisterController],
  providers: [JenisRegisterService],
})
export class JenisRegisterModule {}
