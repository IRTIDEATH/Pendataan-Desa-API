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
import { SearchRegisterDto } from './dto/search-register.dto';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { BulkDeleteRegisterDto } from './dto/bulk-delete-register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateRegisterDto) {
    const [newRegister] = await this.database
      .insert(schema.register)
      .values({
        userId: dto.userId,
        wargaId: dto.wargaId,
        pindahId: dto.pindahId,
        jenisRegisterId: dto.jenisRegisterId,
        keperluan: dto.keperluan,
      })
      .onConflictDoNothing()
      .returning();

    if (!newRegister) {
      throw new ConflictException('This user already has register data.');
    }

    return newRegister;
  }

  async findAll(dto: SearchRegisterDto) {
    const { current_page = 1, size = 10 } = dto;
    const offset = (current_page - 1) * size;

    const whereCondition = dto.q
      ? or(
          ilike(schema.register.keperluan, `%${dto.q}%`),
          ilike(schema.warga.namaWarga, `%${dto.q}%`),
          ilike(schema.jenisRegister.jenisRegister, `%${dto.q}%`),
        )
      : undefined;

    const query = this.database
      .select({
        id: schema.register.id,
        userId: schema.register.userId,
        wargaId: schema.register.wargaId,
        pindahId: schema.register.pindahId,
        jenisRegisterId: schema.register.jenisRegisterId,
        keperluan: schema.register.keperluan,
        createdAt: schema.register.createdAt,
        updatedAt: schema.register.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        wargaNama: schema.warga.namaWarga,
        wargaNik: schema.warga.nik,
        pindahJenis: schema.pindah.jenisPindah,
        jenisRegisterJenis: schema.jenisRegister.jenisRegister,
      })
      .from(schema.register)
      .leftJoin(schema.user, eq(schema.register.userId, schema.user.id))
      .leftJoin(schema.warga, eq(schema.register.wargaId, schema.warga.id))
      .leftJoin(schema.pindah, eq(schema.register.pindahId, schema.pindah.id))
      .leftJoin(
        schema.jenisRegister,
        eq(schema.register.jenisRegisterId, schema.jenisRegister.id),
      )
      .where(whereCondition)
      .orderBy(desc(schema.register.createdAt));

    const [registers, [{ count }]] = await Promise.all([
      query.limit(size).offset(offset),
      this.database
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(schema.register)
        .leftJoin(schema.warga, eq(schema.register.wargaId, schema.warga.id))
        .leftJoin(
          schema.jenisRegister,
          eq(schema.register.jenisRegisterId, schema.jenisRegister.id),
        )
        .where(whereCondition),
    ]);

    return {
      data: registers,
      pagination: {
        totalItems: count,
        currentPage: current_page,
        pageSize: size,
        totalPages: Math.ceil(count / size),
      },
    };
  }

  async findById(registerId: string) {
    const [register] = await this.database
      .select({
        id: schema.register.id,
        userId: schema.register.userId,
        wargaId: schema.register.wargaId,
        pindahId: schema.register.pindahId,
        jenisRegisterId: schema.register.jenisRegisterId,
        keperluan: schema.register.keperluan,
        createdAt: schema.register.createdAt,
        updatedAt: schema.register.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        wargaNama: schema.warga.namaWarga,
        wargaNik: schema.warga.nik,
        wargaAlamat: schema.warga.alamat,
        pindahJenis: schema.pindah.jenisPindah,
        jenisRegisterJenis: schema.jenisRegister.jenisRegister,
      })
      .from(schema.register)
      .leftJoin(schema.user, eq(schema.register.userId, schema.user.id))
      .leftJoin(schema.warga, eq(schema.register.wargaId, schema.warga.id))
      .leftJoin(schema.pindah, eq(schema.register.pindahId, schema.pindah.id))
      .leftJoin(
        schema.jenisRegister,
        eq(schema.register.jenisRegisterId, schema.jenisRegister.id),
      )
      .where(eq(schema.register.id, registerId))
      .limit(1);

    if (!register) {
      throw new NotFoundException('Register not found');
    }

    return register;
  }

  async update(registerId: string, dto: UpdateRegisterDto) {
    await this.findById(registerId);

    return this.database
      .update(schema.register)
      .set({
        wargaId: dto.wargaId,
        pindahId: dto.pindahId,
        jenisRegisterId: dto.jenisRegisterId,
        keperluan: dto.keperluan,
        updatedAt: new Date(),
      })
      .where(eq(schema.register.id, registerId))
      .returning();
  }

  async remove(registerId: string) {
    await this.findById(registerId);

    return this.database
      .delete(schema.register)
      .where(eq(schema.register.id, registerId));
  }

  async removeBulk(dto: BulkDeleteRegisterDto) {
    return await this.database.transaction(async (tx) => {
      const existing = await tx
        .select({ id: schema.register.id })
        .from(schema.register)
        .where(sql`${schema.register.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      if (existing.length !== dto.ids.length) {
        throw new NotFoundException('Some Register IDs not found');
      }

      const result = await tx
        .delete(schema.register)
        .where(sql`${schema.register.id} = ANY(${sql.placeholder('ids')})`)
        .execute({ ids: dto.ids });

      return {
        count: result.rowCount || 0,
      };
    });
  }

  async findByUserId(userId: string) {
    const [register] = await this.database
      .select({
        id: schema.register.id,
        userId: schema.register.userId,
        wargaId: schema.register.wargaId,
        pindahId: schema.register.pindahId,
        jenisRegisterId: schema.register.jenisRegisterId,
        keperluan: schema.register.keperluan,
        createdAt: schema.register.createdAt,
        updatedAt: schema.register.updatedAt,

        // Include related data
        userName: schema.user.name,
        userEmail: schema.user.email,
        wargaNama: schema.warga.namaWarga,
        wargaNik: schema.warga.nik,
        wargaAlamat: schema.warga.alamat,
        pindahJenis: schema.pindah.jenisPindah,
        jenisRegisterJenis: schema.jenisRegister.jenisRegister,
      })
      .from(schema.register)
      .leftJoin(schema.user, eq(schema.register.userId, schema.user.id))
      .leftJoin(schema.warga, eq(schema.register.wargaId, schema.warga.id))
      .leftJoin(schema.pindah, eq(schema.register.pindahId, schema.pindah.id))
      .leftJoin(
        schema.jenisRegister,
        eq(schema.register.jenisRegisterId, schema.jenisRegister.id),
      )
      .where(eq(schema.register.userId, userId))
      .limit(1);

    if (!register) {
      throw new NotFoundException('Register not found for this user');
    }

    return register;
  }
}
