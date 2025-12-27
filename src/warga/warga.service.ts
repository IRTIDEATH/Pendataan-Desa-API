import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/common/database/database-connection';
import * as schema from '../common/database/schema';
import { desc, eq, ilike, sql, or } from 'drizzle-orm';
import { SearchWargaDto } from './dto/search-warga.dto';
import { CreateWargaDto } from './dto/create-warga.dto';
import { UpdateWargaDto } from './dto/update-warga.dto';
import { BulkDeleteWargaDto } from './dto/bulk-delete-warga.dto';

@Injectable()
export class WargaService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateWargaDto) {
    // Use transaction to ensure data consistency
    return await this.database.transaction(async (tx) => {
      let pekerjaanId: string;

      // Check if the pekerjaan already exists
      const existingPekerjaan = await tx
        .select()
        .from(schema.pekerjaan)
        .where(eq(schema.pekerjaan.namaPekerjaan, dto.namaPekerjaan))
        .limit(1);

      if (existingPekerjaan.length > 0) {
        // If pekerjaan exists, use its ID
        pekerjaanId = existingPekerjaan[0].id;
      } else {
        // If pekerjaan doesn't exist, create a new one
        const newPekerjaan = await tx
          .insert(schema.pekerjaan)
          .values({
            namaPekerjaan: dto.namaPekerjaan,
          })
          .returning();

        pekerjaanId = newPekerjaan[0].id;
      }

      // Create warga with the pekerjaanId
      const [newWarga] = await tx
        .insert(schema.warga)
        .values({
          userId: dto.userId,
          nik: dto.nik,
          namaWarga: dto.namaWarga,
          tempatLahir: dto.tempatLahir,
          tanggalLahir: dto.tanggalLahir,
          warganegaraId: dto.warganegaraId,
          alamat: dto.alamat,
          pekerjaanId,
        })
        .onConflictDoNothing()
        .returning();

      if (!newWarga) {
        throw new ConflictException(
          'This user already has warga data or NIK already exists.',
        );
      }

      return newWarga;
    });
  }

  async findAll(dto: SearchWargaDto) {
    const pageSize = dto.size || 10;
    const currentPage = dto.current_page || 1;
    const offset = (currentPage - 1) * pageSize;

    const whereCondition = dto.q
      ? or(
          ilike(schema.warga.namaWarga, `%${dto.q}%`),
          ilike(schema.warga.nik, `%${dto.q}%`),
          ilike(schema.warga.alamat, `%${dto.q}%`),
        )
      : undefined;

    const query = this.database
      .select({
        id: schema.warga.id,
        userId: schema.warga.userId,
        nik: schema.warga.nik,
        namaWarga: schema.warga.namaWarga,
        tempatLahir: schema.warga.tempatLahir,
        tanggalLahir: schema.warga.tanggalLahir,
        warganegaraId: schema.warga.warganegaraId,
        alamat: schema.warga.alamat,
        pekerjaanId: schema.warga.pekerjaanId,
        createdAt: schema.warga.createdAt,
        updatedAt: schema.warga.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        pekerjaanNama: schema.pekerjaan.namaPekerjaan,
        warganegaraJenis: schema.warganegara.jenisKebangsaan,
      })
      .from(schema.warga)
      .leftJoin(schema.user, eq(schema.warga.userId, schema.user.id))
      .leftJoin(
        schema.pekerjaan,
        eq(schema.warga.pekerjaanId, schema.pekerjaan.id),
      )
      .leftJoin(
        schema.warganegara,
        eq(schema.warga.warganegaraId, schema.warganegara.id),
      )
      .where(whereCondition)
      .orderBy(desc(schema.warga.createdAt));

    const [wargas, [{ count }]] = await Promise.all([
      query.limit(pageSize).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.warga)
        .where(whereCondition),
    ]);

    return {
      data: wargas,
      pagination: {
        totalItems: count,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }

  async findById(wargaId: string) {
    const [warga] = await this.database
      .select({
        id: schema.warga.id,
        userId: schema.warga.userId,
        nik: schema.warga.nik,
        namaWarga: schema.warga.namaWarga,
        tempatLahir: schema.warga.tempatLahir,
        tanggalLahir: schema.warga.tanggalLahir,
        warganegaraId: schema.warga.warganegaraId,
        alamat: schema.warga.alamat,
        pekerjaanId: schema.warga.pekerjaanId,
        createdAt: schema.warga.createdAt,
        updatedAt: schema.warga.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        pekerjaanNama: schema.pekerjaan.namaPekerjaan,
        warganegaraJenis: schema.warganegara.jenisKebangsaan,
      })
      .from(schema.warga)
      .leftJoin(schema.user, eq(schema.warga.userId, schema.user.id))
      .leftJoin(
        schema.pekerjaan,
        eq(schema.warga.pekerjaanId, schema.pekerjaan.id),
      )
      .leftJoin(
        schema.warganegara,
        eq(schema.warga.warganegaraId, schema.warganegara.id),
      )
      .where(eq(schema.warga.id, wargaId))
      .limit(1);

    if (!warga) {
      throw new NotFoundException('Warga not found');
    }

    return warga;
  }

  async update(wargaId: string, dto: UpdateWargaDto) {
    // Use transaction to ensure data consistency for both NIK and pekerjaan updates
    return await this.database.transaction(async (tx) => {
      const existingWarga = await this.findById(wargaId);

      if (dto.nik && dto.nik !== existingWarga.nik) {
        const [conflictingNIK] = await tx
          .select()
          .from(schema.warga)
          .where(eq(schema.warga.nik, dto.nik))
          .limit(1);

        if (conflictingNIK) {
          throw new ConflictException('NIK already exists');
        }
      }
      let pekerjaanId: string = existingWarga.pekerjaanId;

      // Only process pekerjaan if it's provided in the update
      if (dto.namaPekerjaan) {
        // Check if the pekerjaan already exists
        const existingPekerjaan = await tx
          .select()
          .from(schema.pekerjaan)
          .where(eq(schema.pekerjaan.namaPekerjaan, dto.namaPekerjaan))
          .limit(1);

        if (existingPekerjaan.length > 0) {
          // If pekerjaan exists, use its ID
          pekerjaanId = existingPekerjaan[0].id;
        } else {
          // If pekerjaan doesn't exist, create a new one
          const newPekerjaan = await tx
            .insert(schema.pekerjaan)
            .values({
              namaPekerjaan: dto.namaPekerjaan,
            })
            .returning();

          pekerjaanId = newPekerjaan[0].id;
        }
      }

      // Update warga with the pekerjaanId
      return tx
        .update(schema.warga)
        .set({
          nik: dto.nik,
          namaWarga: dto.namaWarga,
          tempatLahir: dto.tempatLahir,
          tanggalLahir: dto.tanggalLahir,
          warganegaraId: dto.warganegaraId,
          alamat: dto.alamat,
          pekerjaanId,
          updatedAt: new Date(),
        })
        .where(eq(schema.warga.id, wargaId))
        .returning();
    });
  }

  async remove(wargaId: string) {
    await this.findById(wargaId);

    return this.database
      .delete(schema.warga)
      .where(eq(schema.warga.id, wargaId));
  }

  async removeBulk(dto: BulkDeleteWargaDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.warga.id })
        .from(schema.warga)
        .where(sql`${schema.warga.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Warga IDs not found');
      }

      const result = await tx
        .delete(schema.warga)
        .where(sql`${schema.warga.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }

  async findByUserId(userId: string) {
    const [warga] = await this.database
      .select({
        id: schema.warga.id,
        userId: schema.warga.userId,
        nik: schema.warga.nik,
        namaWarga: schema.warga.namaWarga,
        tempatLahir: schema.warga.tempatLahir,
        tanggalLahir: schema.warga.tanggalLahir,
        warganegaraId: schema.warga.warganegaraId,
        alamat: schema.warga.alamat,
        pekerjaanId: schema.warga.pekerjaanId,
        createdAt: schema.warga.createdAt,
        updatedAt: schema.warga.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        pekerjaanNama: schema.pekerjaan.namaPekerjaan,
        warganegaraJenis: schema.warganegara.jenisKebangsaan,
      })
      .from(schema.warga)
      .leftJoin(schema.user, eq(schema.warga.userId, schema.user.id))
      .leftJoin(
        schema.pekerjaan,
        eq(schema.warga.pekerjaanId, schema.pekerjaan.id),
      )
      .leftJoin(
        schema.warganegara,
        eq(schema.warga.warganegaraId, schema.warganegara.id),
      )
      .where(eq(schema.warga.userId, userId))
      .limit(1);

    if (!warga) {
      throw new NotFoundException('Warga not found for this user');
    }

    return warga;
  }
}
