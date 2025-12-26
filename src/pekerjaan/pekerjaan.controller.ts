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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('pekerjaan')
@AllowAnonymous()
@Controller('pekerjaan')
export class PekerjaanController {
  constructor(private readonly pekerjaanService: PekerjaanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pekerjaan' })
  @ApiResponse({
    status: 201,
    description: 'The pekerjaan has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          namaPekerjaan: 'Software Engineer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Pekerjaan name already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreatePekerjaanDto) {
    const result = await this.pekerjaanService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all pekerjaan with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for nama pekerjaan',
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
    description: 'List of pekerjaan',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            namaPekerjaan: 'Software Engineer',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            namaPekerjaan: 'Data Analyst',
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
  async findAll(@Query() dto: SearchPekerjaanDto) {
    return this.pekerjaanService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pekerjaan by ID' })
  @ApiParam({ name: 'id', description: 'Pekerjaan ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pekerjaan details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          namaPekerjaan: 'Teacher',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pekerjaan not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) pekerjaanId: string) {
    const result = await this.pekerjaanService.findById(pekerjaanId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pekerjaan by ID' })
  @ApiParam({ name: 'id', description: 'Pekerjaan ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pekerjaan has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          namaPekerjaan: 'Lecturer',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pekerjaan not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Pekerjaan name already exists.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
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
  @ApiOperation({ summary: 'Delete a pekerjaan by ID' })
  @ApiParam({ name: 'id', description: 'Pekerjaan ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The pekerjaan has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Pekerjaan deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Pekerjaan not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) pekerjaanId: string) {
    await this.pekerjaanService.remove(pekerjaanId);
    return {
      data: { message: 'Pekerjaan deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple pekerjaan at once' })
  @ApiResponse({
    status: 200,
    description: 'The pekerjaan have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Pekerjaan deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Some Pekerjaan IDs not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeletePekerjaanDto) {
    const result = await this.pekerjaanService.removeBulk(dto);
    return {
      data: { message: `${result.count} Pekerjaan deleted successfully` },
    };
  }
}
