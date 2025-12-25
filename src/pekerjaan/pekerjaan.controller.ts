import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PekerjaanService } from './pekerjaan.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SearchPekerjaanDto } from './dto/search-pekerjaan.dto';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';
import { UpdatePekerjaanDto } from './dto/update-pekerjaan.dto';
import { BulkDeletePekerjaanDto } from './dto/bulk-delete-pekerjaan.dto';

@AllowAnonymous()
@Controller('pekerjaan')
export class PekerjaanController {
  constructor(private readonly pekerjaanService: PekerjaanService) {}

  @Post()
  async create(@Body() dto: CreatePekerjaanDto) {
    const result = await this.pekerjaanService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  async findAll(@Query() dto: SearchPekerjaanDto) {
    return this.pekerjaanService.findAll(dto);
  }

  @Get('/:id')
  async findById(@Param('id', ParseUUIDPipe) pekerjaanId: string) {
    const result = await this.pekerjaanService.findById(pekerjaanId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) pekerjaanId: string,
    @Body() dto: UpdatePekerjaanDto,
  ) {
    const result = await this.pekerjaanService.update(pekerjaanId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) pekerjaanId: string) {
    await this.pekerjaanService.remove(pekerjaanId);
    return {
      data: { message: 'Pekerjaan deleted successfully' },
    };
  }

  @Post('bulk')
  async removeBulk(@Body() dto: BulkDeletePekerjaanDto) {
    const result = await this.pekerjaanService.removeBulk(dto);
    return {
      data: { message: `${result.count} Pekerjaan deleted successfully` },
    };
  }
}
