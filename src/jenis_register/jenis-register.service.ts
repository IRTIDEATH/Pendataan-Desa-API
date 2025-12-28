import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/common/database/database-connection';
import * as schema from '../common/database/schema';
import { desc, eq, ilike, sql } from 'drizzle-orm';
import { SearchJenisRegisterDto } from './dto/search-jenis-register.dto';
import { CreateJenisRegisterDto } from './dto/create-jenis-register.dto';
import { UpdateJenisRegisterDto } from './dto/update-jenis-register.dto';
import { BulkDeleteJenisRegisterDto } from './dto/bulk-delete-jenis-register.dto';

@Injectable()
export class JenisRegisterService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateJenisRegisterDto) {
    const [newJenisRegister] = await this.database
      .insert(schema.jenisRegister)
      .values({
        jenisRegister: dto.jenisRegister,
      })
      .onConflictDoNothing()
      .returning();

    if (!newJenisRegister) {
      throw new ConflictException(
        'The jenis register name has already been used. Please change it.',
      );
    }

    return newJenisRegister;
  }

  async findAll(dto: SearchJenisRegisterDto) {
    const { current_page = 1, size = 10 } = dto;
    const offset = (current_page - 1) * size;

    const whereCondition = dto.q
      ? ilike(schema.jenisRegister.jenisRegister, `%${dto.q}%`)
      : undefined;

    const query = this.database
      .select({
        id: schema.jenisRegister.id,
        jenisRegister: schema.jenisRegister.jenisRegister,
        createdAt: schema.jenisRegister.createdAt,
        updatedAt: schema.jenisRegister.updatedAt,
      })
      .from(schema.jenisRegister)
      .where(whereCondition)
      .orderBy(desc(schema.jenisRegister.createdAt));

    const [jenisRegister, [{ count }]] = await Promise.all([
      query.limit(size).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.jenisRegister)
        .where(whereCondition),
    ]);

    return {
      data: jenisRegister,
      pagination: {
        totalItems: count,
        currentPage: current_page,
        pageSize: size,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findById(jenisRegisterId: string) {
    const [jenisRegister] = await this.database
      .select({
        id: schema.jenisRegister.id,
        jenisRegister: schema.jenisRegister.jenisRegister,
        createdAt: schema.jenisRegister.createdAt,
        updatedAt: schema.jenisRegister.updatedAt,
      })
      .from(schema.jenisRegister)
      .where(eq(schema.jenisRegister.id, jenisRegisterId));

    if (!jenisRegister) {
      throw new NotFoundException('Jenis Register not found');
    }

    return jenisRegister;
  }

  async update(jenisRegisterId: string, dto: UpdateJenisRegisterDto) {
    return await this.database.transaction(async (tx) => {
      const existingJenisRegister = await this.findById(jenisRegisterId);

      if (
        dto.jenisRegister &&
        dto.jenisRegister !== existingJenisRegister.jenisRegister
      ) {
        const [conflictingJenisRegister] = await tx
          .select()
          .from(schema.jenisRegister)
          .where(eq(schema.jenisRegister.jenisRegister, dto.jenisRegister));

        if (conflictingJenisRegister) {
          throw new ConflictException('Jenis register already exists');
        }
      }

      return tx
        .update(schema.jenisRegister)
        .set({
          jenisRegister: dto.jenisRegister,
          updatedAt: new Date(),
        })
        .where(eq(schema.jenisRegister.id, jenisRegisterId))
        .returning();
    });
  }

  async remove(jenisRegisterId: string) {
    await this.findById(jenisRegisterId);

    return this.database
      .delete(schema.jenisRegister)
      .where(eq(schema.jenisRegister.id, jenisRegisterId));
  }

  async removeBulk(dto: BulkDeleteJenisRegisterDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.jenisRegister.id })
        .from(schema.jenisRegister)
        .where(sql`${schema.jenisRegister.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Jenis Register IDs not found');
      }

      const result = await tx
        .delete(schema.jenisRegister)
        .where(sql`${schema.jenisRegister.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }
}
