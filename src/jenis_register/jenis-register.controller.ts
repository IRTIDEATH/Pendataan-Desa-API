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
import { JenisRegisterService } from './jenis-register.service';
import { SearchJenisRegisterDto } from './dto/search-jenis-register.dto';
import { CreateJenisRegisterDto } from './dto/create-jenis-register.dto';
import { UpdateJenisRegisterDto } from './dto/update-jenis-register.dto';
import { BulkDeleteJenisRegisterDto } from './dto/bulk-delete-jenis-register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('jenis-register')
@Controller('jenis-register')
export class JenisRegisterController {
  constructor(private readonly jenisRegisterService: JenisRegisterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new jenis register' })
  @ApiResponse({
    status: 201,
    description: 'The jenis register has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisRegister: 'Pernikahan',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis register name already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreateJenisRegisterDto) {
    const result = await this.jenisRegisterService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all jenis register with pagination and search',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for jenis register',
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
    description: 'List of jenis register',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            jenisRegister: 'Pernikahan',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            jenisRegister: 'Kelahiran',
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
  async findAll(@Query() dto: SearchJenisRegisterDto) {
    return this.jenisRegisterService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a jenis register by ID' })
  @ApiParam({ name: 'id', description: 'Jenis Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The jenis register details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisRegister: 'Pernikahan',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Jenis Register not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) jenisRegisterId: string) {
    const result = await this.jenisRegisterService.findById(jenisRegisterId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a jenis register by ID' })
  @ApiParam({ name: 'id', description: 'Jenis Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The jenis register has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          jenisRegister: 'Pernikahan',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Jenis Register not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Jenis register name already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
  async update(
    @Param('id', ParseUUIDPipe) jenisRegisterId: string,
    @Body() dto: UpdateJenisRegisterDto,
  ) {
    const result = await this.jenisRegisterService.update(jenisRegisterId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jenis register by ID' })
  @ApiParam({ name: 'id', description: 'Jenis Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The jenis register has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Jenis Register deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Jenis Register not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) jenisRegisterId: string) {
    await this.jenisRegisterService.remove(jenisRegisterId);
    return {
      data: { message: 'Jenis Register deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple jenis register at once' })
  @ApiResponse({
    status: 200,
    description: 'The jenis register have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Jenis Register deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Some Jenis Register IDs not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeleteJenisRegisterDto) {
    const result = await this.jenisRegisterService.removeBulk(dto);
    return {
      data: { message: `${result.count} Jenis Register deleted successfully` },
    };
  }
}
