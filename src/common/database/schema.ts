import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const warga = pgTable('warga', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  nik: text('nik').notNull(),
  namaWarga: text('nama_warga').notNull(),
  tempatLahir: text('tempat_lahir').notNull(),
  tanggalLahir: timestamp('tanggal_lahir', { mode: 'date' }).notNull(),
  warganegaraId: uuid('warganegara_id')
    .notNull()
    .references(() => warganegara.id, { onDelete: 'cascade' }),
  alamat: text('alamat').notNull(),
  pekerjaanId: uuid('pekerjaan_id')
    .notNull()
    .references(() => pekerjaan.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const pekerjaan = pgTable('pekerjaan', {
  id: uuid('id').primaryKey().defaultRandom(),
  namaPekerjaan: text('nama_pekerjaan').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const register = pgTable('register', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  wargaId: uuid('warga_id')
    .notNull()
    .references(() => warga.id, { onDelete: 'cascade' }),
  pindahId: uuid('pindah_id')
    .notNull()
    .references(() => pindah.id, { onDelete: 'cascade' }),
  jenisRegisterId: uuid('jenis_register_id')
    .notNull()
    .references(() => jenisRegister.id, { onDelete: 'cascade' }),
  keperluan: text('keperluan').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const pindah = pgTable('pindah', {
  id: uuid('id').primaryKey().defaultRandom(),
  jenisPindah: text('jenis_pindah').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const jenisRegister = pgTable('jenis_register', {
  id: uuid('id').primaryKey().defaultRandom(),
  jenisRegister: text('jenis_register').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const warganegara = pgTable('warganegara', {
  id: uuid('id').primaryKey().defaultRandom(),
  jenisKebangsaan: text('jenis_kebangsaan').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const wargaRelations = relations(warga, ({ one, many }) => ({
  user: one(user, {
    fields: [warga.userId],
    references: [user.id],
  }),
  pekerjaan: one(pekerjaan, {
    fields: [warga.pekerjaanId],
    references: [pekerjaan.id],
  }),
  warganegara: one(warganegara, {
    fields: [warga.warganegaraId],
    references: [warganegara.id],
  }),
  registers: many(register),
}));

export const pekerjaanRelations = relations(pekerjaan, ({ many }) => ({
  wargas: many(warga),
}));

export const registerRelations = relations(register, ({ one }) => ({
  user: one(user, {
    fields: [register.userId],
    references: [user.id],
  }),
  warga: one(warga, {
    fields: [register.wargaId],
    references: [warga.id],
  }),
  pindah: one(pindah, {
    fields: [register.pindahId],
    references: [pindah.id],
  }),
  jenisRegister: one(jenisRegister, {
    fields: [register.jenisRegisterId],
    references: [jenisRegister.id],
  }),
}));

export const pindahRelations = relations(pindah, ({ many }) => ({
  registers: many(register),
}));

export const jenisRegisterRelations = relations(jenisRegister, ({ many }) => ({
  registers: many(register),
}));

export const warganegaraRelations = relations(warganegara, ({ many }) => ({
  wargas: many(warga),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  wargas: many(warga),
  registers: many(register),
}));
