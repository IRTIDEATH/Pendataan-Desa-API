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
import { PindahService } from './pindah.service';
import { SearchPindahDto } from './dto/search-pindah.dto';
import { CreatePindahDto } from './dto/create-pindah.dto';
import { UpdatePindahDto } from './dto/update-pindah.dto';
import { BulkDeletePindahDto } from './dto/bulk-delete-pindah.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('pindah')
@Controller('pindah')
export class PindahController {
  constructor(private readonly pindahService: PindahService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pindah' })
  @ApiResponse({
    status: 201,
    description: 'The pindah has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisPindah: 'Datang',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis pindah already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreatePindahDto) {
    const result = await this.pindahService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all pindah with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for jenis pindah',
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
    description: 'List of pindah',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            jenisPindah: 'Datang',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            jenisPindah: 'Keluar',
            createdAt: '2023-06-15T08:35:00.000Z',
            updatedAt: '2023-06-15T08:35:00.000Z',
          },
        ],
        pagination: {
          totalItems: 10,
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    },
  })
  async findAll(@Query() dto: SearchPindahDto) {
    return this.pindahService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pindah by ID' })
  @ApiParam({ name: 'id', description: 'Pindah ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pindah details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisPindah: 'Datang',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pindah not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) pindahId: string) {
    const result = await this.pindahService.findById(pindahId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pindah by ID' })
  @ApiParam({ name: 'id', description: 'Pindah ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pindah has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisPindah: 'Keluar',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pindah not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis pindah already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
  async update(
    @Param('id', ParseUUIDPipe) pindahId: string,
    @Body() dto: UpdatePindahDto,
  ) {
    const result = await this.pindahService.update(pindahId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pindah by ID' })
  @ApiParam({ name: 'id', description: 'Pindah ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pindah has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Pindah deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pindah not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) pindahId: string) {
    await this.pindahService.remove(pindahId);
    return {
      data: { message: 'Pindah deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple pindah at once' })
  @ApiResponse({
    status: 200,
    description: 'The pindah have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Pindah deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Some Pindah IDs not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeletePindahDto) {
    const result = await this.pindahService.removeBulk(dto);
    return {
      data: { message: `${result.count} Pindah deleted successfully` },
    };
  }
}
