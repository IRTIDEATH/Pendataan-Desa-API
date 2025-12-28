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
import { RegisterService } from './register.service';
import { SearchRegisterDto } from './dto/search-register.dto';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { BulkDeleteRegisterDto } from './dto/bulk-delete-register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new register' })
  @ApiResponse({
    status: 201,
    description: 'The register has been successfully created.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          wargaId: '550e8400-e29b-41d4-a716-446655440002',
          pindahId: '550e8400-e29b-41d4-a716-446655440003',
          jenisRegisterId: '550e8400-e29b-41d4-a716-446655440004',
          keperluan: 'Pengurusan KTP',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already has register data.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async create(@Body() dto: CreateRegisterDto) {
    const result = await this.registerService.create(dto);
    return {
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all registers with pagination and search' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for keperluan, warga name, or jenis register',
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
    description: 'List of registers',
    schema: {
      example: {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            userId: '550e8400-e29b-41d4-a716-446655440001',
            wargaId: '550e8400-e29b-41d4-a716-446655440002',
            pindahId: '550e8400-e29b-41d4-a716-446655440003',
            jenisRegisterId: '550e8400-e29b-41d4-a716-446655440004',
            keperluan: 'Pengurusan KTP',
            createdAt: '2023-06-15T08:30:00.000Z',
            updatedAt: '2023-06-15T08:30:00.000Z',
            userName: 'John User',
            userEmail: 'john@example.com',
            wargaNama: 'John Doe',
            wargaNik: '3171011502970001',
            pindahJenis: 'Pindah Desa',
            jenisRegisterJenis: 'Kependudukan',
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
  async findAll(@Query() dto: SearchRegisterDto) {
    return this.registerService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a register by ID' })
  @ApiParam({ name: 'id', description: 'Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The register details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          wargaId: '550e8400-e29b-41d4-a716-446655440002',
          pindahId: '550e8400-e29b-41d4-a716-446655440003',
          jenisRegisterId: '550e8400-e29b-41d4-a716-446655440004',
          keperluan: 'Pengurusan KTP',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
          userName: 'John User',
          userEmail: 'john@example.com',
          wargaNama: 'John Doe',
          wargaNik: '3171011502970001',
          wargaAlamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
          pindahJenis: 'Pindah Desa',
          jenisRegisterJenis: 'Kependudukan',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Register not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findById(@Param('id', ParseUUIDPipe) registerId: string) {
    const result = await this.registerService.findById(registerId);
    return {
      data: result,
    };
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get a register by User ID' })
  @ApiParam({ name: 'userId', description: 'User ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The register details',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          wargaId: '550e8400-e29b-41d4-a716-446655440002',
          pindahId: '550e8400-e29b-41d4-a716-446655440003',
          jenisRegisterId: '550e8400-e29b-41d4-a716-446655440004',
          keperluan: 'Pengurusan KTP',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-15T08:30:00.000Z',
          userName: 'John User',
          userEmail: 'john@example.com',
          wargaNama: 'John Doe',
          wargaNik: '3171011502970001',
          wargaAlamat: 'Jl. Merdeka No. 123, Jakarta Pusat',
          pindahJenis: 'Pindah Desa',
          jenisRegisterJenis: 'Kependudukan',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Register not found for this user.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    const result = await this.registerService.findByUserId(userId);
    return {
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a register by ID' })
  @ApiParam({ name: 'id', description: 'Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The register has been successfully updated.',
    schema: {
      example: {
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          wargaId: '550e8400-e29b-41d4-a716-446655440002',
          pindahId: '550e8400-e29b-41d4-a716-446655440005',
          jenisRegisterId: '550e8400-e29b-41d4-a716-446655440004',
          keperluan: 'Pengurusan KK',
          createdAt: '2023-06-15T08:30:00.000Z',
          updatedAt: '2023-06-16T10:15:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Register not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or input data.',
  })
  async update(
    @Param('id', ParseUUIDPipe) registerId: string,
    @Body() dto: UpdateRegisterDto,
  ) {
    const result = await this.registerService.update(registerId, dto);
    return {
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a register by ID' })
  @ApiParam({ name: 'id', description: 'Register ID (UUID format)' })
  @ApiResponse({
    status: 200,
    description: 'The register has been successfully deleted.',
    schema: {
      example: {
        data: { message: 'Register deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Register not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid ID format.' })
  async remove(@Param('id', ParseUUIDPipe) registerId: string) {
    await this.registerService.remove(registerId);
    return {
      data: { message: 'Register deleted successfully' },
    };
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Delete multiple registers at once' })
  @ApiResponse({
    status: 200,
    description: 'The registers have been successfully deleted.',
    schema: {
      example: {
        data: { message: '5 Registers deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Some Register IDs not found.' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format or empty ID list.',
  })
  async removeBulk(@Body() dto: BulkDeleteRegisterDto) {
    const result = await this.registerService.removeBulk(dto);
    return {
      data: { message: `${result.count} Registers deleted successfully` },
    };
  }
}
