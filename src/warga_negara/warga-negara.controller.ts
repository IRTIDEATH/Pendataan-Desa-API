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
import { WargaNegaraService } from './warga-negara.service';
import { SearchWargaNegaraDto } from './dto/search-warga-negara.dto';
import { CreateWargaNegaraDto } from './dto/create-warga-negara.dto';
import { UpdateWargaNegaraDto } from './dto/update-warga-negara.dto';
import { BulkDeleteWargaNegaraDto } from './dto/bulk-delete-warga-negara.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('warga-negara')
@Controller('warga-negara')
export class WargaNegaraController {
  constructor(private readonly wargaNegaraService: WargaNegaraService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warga negara' })
  @ApiResponse({
    status: 201,
    description: 'The warga negara has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisKebangsaan: 'WNI',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis kebangsaan already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreateWargaNegaraDto) {
    const result = await this.wargaNegaraService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all warga negara with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for jenis kebangsaan',
  })
  @ApiQuery({
    name: 'current_page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Page size (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of warga negara',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            jenisKebangsaan: 'WNI',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            jenisKebangsaan: 'WNA',
            createdAt: '2023-06-15T08:35:00.000Z',
            updatedAt: '2023-06-15T08:35:00.000Z',
          },
        ],
        pagination: {
          totalItems: 50,
          currentPage: 1,
          pageSize: 10,
          totalPages: 5,
        },
      },
    },
  })
  async findAll(@Query() dto: SearchWargaNegaraDto) {
    return this.wargaNegaraService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warga negara by ID' })
  @ApiParam({ name: 'id', description: 'Warga Negara ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga negara details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisKebangsaan: 'WNI',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga negara not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) wargaNegaraId: string) {
    const result = await this.wargaNegaraService.findById(wargaNegaraId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warga negara by ID' })
  @ApiParam({ name: 'id', description: 'Warga Negara ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga negara has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisKebangsaan: 'WNA',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga negara not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis kebangsaan already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
  async update(
    @Param('id', ParseUUIDPipe) wargaNegaraId: string,
    @Body() dto: UpdateWargaNegaraDto,
  ) {
    const result = await this.wargaNegaraService.update(wargaNegaraId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warga negara by ID' })
  @ApiParam({ name: 'id', description: 'Warga Negara ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga negara has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Warga negara deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga negara not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) wargaNegaraId: string) {
    await this.wargaNegaraService.remove(wargaNegaraId);
    return {
      data: { message: 'Warga negara deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple warga negara at once' })
  @ApiResponse({
    status: 200,
    description: 'The warga negara have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Warga negara deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Some Warga negara IDs not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeleteWargaNegaraDto) {
    const result = await this.wargaNegaraService.removeBulk(dto);
    return {
      data: { message: `${result.count} Warga negara deleted successfully` },
    };
  }
}
