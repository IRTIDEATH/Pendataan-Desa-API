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
import { SearchPindahDto } from './dto/search-pindah.dto';
import { CreatePindahDto } from './dto/create-pindah.dto';
import { UpdatePindahDto } from './dto/update-pindah.dto';
import { BulkDeletePindahDto } from './dto/bulk-delete-pindah.dto';

@Injectable()
export class PindahService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreatePindahDto) {
    const [newPindah] = await this.database
      .insert(schema.pindah)
      .values({
        jenisPindah: dto.jenisPindah,
      })
      .onConflictDoNothing()
      .returning();

    if (!newPindah) {
      throw new ConflictException('Jenis pindah already exists');
    }

    return newPindah;
  }

  async findAll(dto: SearchPindahDto) {
    const pageSize = dto.size || 10;
    const currentPage = dto.current_page || 1;
    const offset = (currentPage - 1) * pageSize;

    const whereCondition = dto.q
      ? ilike(schema.pindah.jenisPindah, `%${dto.q}%`)
      : undefined;

    const query = this.database
      .select({
        id: schema.pindah.id,
        jenisPindah: schema.pindah.jenisPindah,
        createdAt: schema.pindah.createdAt,
        updatedAt: schema.pindah.updatedAt,
      })
      .from(schema.pindah)
      .where(whereCondition)
      .orderBy(desc(schema.pindah.createdAt));

    const [pindahs, [{ count }]] = await Promise.all([
      query.limit(pageSize).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.pindah)
        .where(whereCondition),
    ]);

    return {
      data: pindahs,
      pagination: {
        totalItems: count,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async findById(pindahId: string) {
    const [pindah] = await this.database
      .select({
        id: schema.pindah.id,
        jenisPindah: schema.pindah.jenisPindah,
        createdAt: schema.pindah.createdAt,
        updatedAt: schema.pindah.updatedAt,
      })
      .from(schema.pindah)
      .where(eq(schema.pindah.id, pindahId))
      .limit(1);

    if (!pindah) {
      throw new NotFoundException('Pindah not found');
    }

    return pindah;
  }

  async update(pindahId: string, dto: UpdatePindahDto) {
    return await this.database.transaction(async (tx) => {
      const existingPindah = await this.findById(pindahId);

      if (dto.jenisPindah && dto.jenisPindah !== existingPindah.jenisPindah) {
        const [conflictingPindah] = await tx
          .select()
          .from(schema.pindah)
          .where(eq(schema.pindah.jenisPindah, dto.jenisPindah))
          .limit(1);

        if (conflictingPindah) {
          throw new ConflictException('Jenis pindah already exists');
        }
      }

      return tx
        .update(schema.pindah)
        .set({
          jenisPindah: dto.jenisPindah,
          updatedAt: new Date(),
        })
        .where(eq(schema.pindah.id, pindahId))
        .returning();
    });
  }

  async remove(pindahId: string) {
    await this.findById(pindahId);

    return this.database
      .delete(schema.pindah)
      .where(eq(schema.pindah.id, pindahId));
  }

  async removeBulk(dto: BulkDeletePindahDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.pindah.id })
        .from(schema.pindah)
        .where(sql`${schema.pindah.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Pindah IDs not found');
      }

      const result = await tx
        .delete(schema.pindah)
        .where(sql`${schema.pindah.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }
}
