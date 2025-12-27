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
import { WargaService } from './warga.service';
import { SearchWargaDto } from './dto/search-warga.dto';
import { CreateWargaDto } from './dto/create-warga.dto';
import { UpdateWargaDto } from './dto/update-warga.dto';
import { BulkDeleteWargaDto } from './dto/bulk-delete-warga.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('warga')
@Controller('warga')
export class WargaController {
  constructor(private readonly wargaService: WargaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warga' })
  @ApiResponse({
    status: 201,
    description: 'The warga has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          nik: '3171011502970001',
          namaWarga: 'John Doe',
          tempatLahir: 'Jakarta',
          tanggalLahir: '1997-02-15',
          warganegaraId: '550e8400-e29b-41d4-a716-446655440002',
          alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
          pekerjaanId: '550e8400-e29b-41d4-a716-446655440003',
          pekerjaanNama: 'Software Engineer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - User already has warga data or NIK already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreateWargaDto) {
    const result = await this.wargaService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all warga with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for nama warga, NIK, or alamat',
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
    description: 'List of warga',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            userId: '550e8400-e29b-41d4-a716-446655440001',
            nik: '3171011502970001',
            namaWarga: 'John Doe',
            tempatLahir: 'Jakarta',
            tanggalLahir: '1997-02-15',
            warganegaraId: '550e8400-e29b-41d4-a716-446655440002',
            alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
            pekerjaanId: '550e8400-e29b-41d4-a716-446655440003',
            pekerjaanNama: 'Software Engineer',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
            userName: 'John User',
            userEmail: 'john@example.com',
            warganegaraJenis: 'WNI',
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
  async findAll(@Query() dto: SearchWargaDto) {
    return this.wargaService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warga by ID' })
  @ApiParam({ name: 'id', description: 'Warga ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          nik: '3171011502970001',
          namaWarga: 'John Doe',
          tempatLahir: 'Jakarta',
          tanggalLahir: '1997-02-15',
          warganegaraId: '550e8400-e29b-41d4-a716-446655440002',
          alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
          pekerjaanId: '550e8400-e29b-41d4-a716-446655440003',
          pekerjaanNama: 'Software Engineer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
          userName: 'John User',
          userEmail: 'john@example.com',
          warganegaraJenis: 'WNI',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) wargaId: string) {
    const result = await this.wargaService.findById(wargaId);
    return {
      data: result,
    };
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get a warga by User ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          nik: '3171011502970001',
          namaWarga: 'John Doe',
          tempatLahir: 'Jakarta',
          tanggalLahir: '1997-02-15',
          warganegaraId: '550e8400-e29b-41d4-a716-446655440002',
          alamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
          pekerjaanId: '550e8400-e29b-41d4-a716-446655440003',
          pekerjaanNama: 'Software Engineer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
          userName: 'John User',
          userEmail: 'john@example.com',
          warganegaraJenis: 'WNI',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga not found for this user.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    const result = await this.wargaService.findByUserId(userId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a warga by ID' })
  @ApiParam({ name: 'id', description: 'Warga ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          nik: '3171011502970001',
          namaWarga: 'John Smith',
          tempatLahir: 'Jakarta',
          tanggalLahir: '1997-02-15',
          warganegaraId: '550e8400-e29b-41d4-a716-446655440002',
          alamat: 'Jl. Sudirman No. 456, Jakarta Selatan',
          pekerjaanId: '550e8400-e29b-41d4-a716-446655440004',
          pekerjaanNama: 'Senior Software Engineer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - NIK already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
  async update(
    @Param('id', ParseUUIDPipe) wargaId: string,
    @Body() dto: UpdateWargaDto,
  ) {
    const result = await this.wargaService.update(wargaId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warga by ID' })
  @ApiParam({ name: 'id', description: 'Warga ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The warga has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Warga deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Warga not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) wargaId: string) {
    await this.wargaService.remove(wargaId);
    return {
      data: { message: 'Warga deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple warga at once' })
  @ApiResponse({
    status: 200,
    description: 'The warga have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Warga deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Some Warga IDs not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeleteWargaDto) {
    const result = await this.wargaService.removeBulk(dto);
    return {
      data: { message: `${result.count} Warga deleted successfully` },
    };
  }
}
