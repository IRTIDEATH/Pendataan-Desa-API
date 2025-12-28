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
import { SearchWargaNegaraDto } from './dto/search-warga-negara.dto';
import { CreateWargaNegaraDto } from './dto/create-warga-negara.dto';
import { UpdateWargaNegaraDto } from './dto/update-warga-negara.dto';
import { BulkDeleteWargaNegaraDto } from './dto/bulk-delete-warga-negara.dto';

@Injectable()
export class WargaNegaraService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateWargaNegaraDto) {
    const [newWargaNegara] = await this.database
      .insert(schema.warganegara)
      .values({
        jenisKebangsaan: dto.jenisKebangsaan,
      })
      .onConflictDoNothing()
      .returning();

    if (!newWargaNegara) {
      throw new ConflictException(
        'The jenis kebangsaan has already been used. Please change it.',
      );
    }

    return newWargaNegara;
  }

  async findAll(dto: SearchWargaNegaraDto) {
    const { current_page = 1, size = 10 } = dto;
    const offset = (current_page - 1) * size;

    const whereCondition = dto.q
      ? ilike(schema.warganegara.jenisKebangsaan, `%${dto.q}%`)
      : undefined;

    const query = this.database
      .select({
        id: schema.warganegara.id,
        jenisKebangsaan: schema.warganegara.jenisKebangsaan,
        createdAt: schema.warganegara.createdAt,
        updatedAt: schema.warganegara.updatedAt,
      })
      .from(schema.warganegara)
      .where(whereCondition)
      .orderBy(desc(schema.warganegara.createdAt));

    const [wargaNegara, [{ count }]] = await Promise.all([
      query.limit(size).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.warganegara)
        .where(whereCondition),
    ]);

    return {
      data: wargaNegara,
      pagination: {
        totalItems: count,
        currentPage: current_page,
        pageSize: size,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findById(wargaNegaraId: string) {
    const [wargaNegara] = await this.database
      .select({
        id: schema.warganegara.id,
        jenisKebangsaan: schema.warganegara.jenisKebangsaan,
        createdAt: schema.warganegara.createdAt,
        updatedAt: schema.warganegara.updatedAt,
      })
      .from(schema.warganegara)
      .where(eq(schema.warganegara.id, wargaNegaraId));

    if (!wargaNegara) {
      throw new NotFoundException('Warga negara not found');
    }

    return wargaNegara;
  }

  async update(wargaNegaraId: string, dto: UpdateWargaNegaraDto) {
    return await this.database.transaction(async (tx) => {
      const existingWargaNegara = await this.findById(wargaNegaraId);

      if (
        dto.jenisKebangsaan &&
        dto.jenisKebangsaan !== existingWargaNegara.jenisKebangsaan
      ) {
        const [conflictingWargaNegara] = await tx
          .select()
          .from(schema.warganegara)
          .where(eq(schema.warganegara.jenisKebangsaan, dto.jenisKebangsaan));

        if (conflictingWargaNegara) {
          throw new ConflictException('Jenis kebangsaan already exists');
        }
      }

      return tx
        .update(schema.warganegara)
        .set({
          jenisKebangsaan: dto.jenisKebangsaan,
          updatedAt: new Date(),
        })
        .where(eq(schema.warganegara.id, wargaNegaraId))
        .returning();
    });
  }

  async remove(wargaNegaraId: string) {
    await this.findById(wargaNegaraId);

    return this.database
      .delete(schema.warganegara)
      .where(eq(schema.warganegara.id, wargaNegaraId));
  }

  async removeBulk(dto: BulkDeleteWargaNegaraDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.warganegara.id })
        .from(schema.warganegara)
        .where(sql`${schema.warganegara.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Warga Negara IDs not found');
      }

      const result = await tx
        .delete(schema.warganegara)
        .where(sql`${schema.warganegara.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }
}
