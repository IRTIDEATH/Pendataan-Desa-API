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
import { SearchPekerjaanDto } from './dto/search-pekerjaan.dto';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';
import { UpdatePekerjaanDto } from './dto/update-pekerjaan.dto';
import { BulkDeletePekerjaanDto } from './dto/bulk-delete-pekerjaan.dto';

@Injectable()
export class PekerjaanService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreatePekerjaanDto) {
    const [newPekerjaan] = await this.database
      .insert(schema.pekerjaan)
      .values({
        namaPekerjaan: dto.namaPekerjaan,
      })
      .onConflictDoNothing()
      .returning();

    if (!newPekerjaan) {
      throw new ConflictException(
        'The job name has already been used. Please change it.',
      );
    }

    return newPekerjaan;
  }

  async findAll(dto: SearchPekerjaanDto) {
    const offset = (dto.current_page - 1) * dto.size;

    const whereCondition = dto.q
      ? ilike(schema.pekerjaan.namaPekerjaan, `%${dto.q}%`)
      : undefined;

    const query = this.database
      .select({
        id: schema.pekerjaan.id,
        namaPekerjaan: schema.pekerjaan.namaPekerjaan,
        createdAt: schema.pekerjaan.createdAt,
        updatedAt: schema.pekerjaan.updatedAt,
      })
      .from(schema.pekerjaan)
      .where(whereCondition)
      .orderBy(desc(schema.pekerjaan.createdAt));

    const [pekerjaan, [{ count }]] = await Promise.all([
      query.limit(dto.size).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.pekerjaan)
        .where(whereCondition),
    ]);

    return {
      data: pekerjaan,
      pagination: {
        totalItems: count,
        currentPage: dto.current_page,
        pageSize: dto.size,
        totalPages: Math.ceil(count / dto.size),
      },
    };
  }

  async findById(pekerjaanId: string) {
    const [pekerjaan] = await this.database
      .select({
        id: schema.pekerjaan.id,
        namaPekerjaan: schema.pekerjaan.namaPekerjaan,
        createdAt: schema.pekerjaan.createdAt,
        updatedAt: schema.pekerjaan.updatedAt,
      })
      .from(schema.pekerjaan)
      .where(eq(schema.pekerjaan.id, pekerjaanId));

    if (!pekerjaan) {
      throw new NotFoundException('Pekerjaan not found');
    }

    return pekerjaan;
  }

  async update(pekerjaanId: string, dto: UpdatePekerjaanDto) {
    const existingPekerjaan = await this.findById(pekerjaanId);

    if (
      dto.namaPekerjaan &&
      dto.namaPekerjaan !== existingPekerjaan.namaPekerjaan
    ) {
      const [conflictingPekerjaan] = await this.database
        .select()
        .from(schema.pekerjaan)
        .where(eq(schema.pekerjaan.namaPekerjaan, dto.namaPekerjaan));

      if (conflictingPekerjaan) {
        throw new ConflictException('Nama pekerjaan already exists');
      }
    }

    return this.database
      .update(schema.pekerjaan)
      .set({
        namaPekerjaan: dto.namaPekerjaan,
        updatedAt: new Date(),
      })
      .where(eq(schema.pekerjaan.id, pekerjaanId))
      .returning();
  }

  async remove(pekerjaanId: string) {
    await this.findById(pekerjaanId);

    return this.database
      .delete(schema.pekerjaan)
      .where(eq(schema.pekerjaan.id, pekerjaanId));
  }

  async removeBulk(dto: BulkDeletePekerjaanDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.pekerjaan.id })
        .from(schema.pekerjaan)
        .where(sql`${schema.pekerjaan.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Pekerjaan IDs not found');
      }

      const result = await tx
        .delete(schema.pekerjaan)
        .where(sql`${schema.pekerjaan.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }
}
