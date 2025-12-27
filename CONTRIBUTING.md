# Kontribusi ke Aplikasi Pendataan Desa Backend

Terima kasih atas minat Anda untuk berkontribusi pada Aplikasi Pendataan Desa Backend! Dokumen ini memberikan panduan tentang cara berkontribusi pada proyek ini.

## Ringkasan

Aplikasi Pendataan Desa Backend adalah REST API yang dibangun dengan Nest.js untuk mengelola data kependudukan desa. Kami menyambut baik kontribusi dalam bentuk laporan bug, permintaan fitur, dan peningkatan dokumentasi maupun kode.

## Bagaimana Anda Dapat Berkontribusi

Anda dapat berkontribusi dengan cara:

- Melaporkan bug yang ditemukan
- Mengusulkan fitur baru
- Menambah atau memperbaiki dokumentasi
- Meningkatkan kode sumber
- Membantu dalam pengujian
- Memberikan saran desain arsitektur

## Persiapan Pengembangan

### Prasyarat

- Node.js (versi 20 atau lebih tinggi)
- npm
- PostgreSQL (versi 16 atau lebih tinggi)
- Git

### Setup Lokal

1. **_Fork_ repositori ini** ke akun GitHub Anda.

2. **_Clone_ repositori** hasil _fork_ Anda ke komputer lokal:

   ```bash
   git clone https://github.com/IRTIDEATH/Pendataan-Desa-API.git
   cd Pendataan-Desa-API
   ```

3. **Instal dependensi** yang dibutuhkan untuk menjalankan proyek:

   ```bash
   npm install
   ```

4. **Setup database PostgreSQL** dan buat database baru untuk proyek ini.

5. **Buat file .env** di root proyek dengan konfigurasi berikut. Anda dapat menyalin dari file `.env.example`:

   ```env
   DATABASE_URL=

   BETTER_AUTH_SECRET=

   BETTER_AUTH_URL="http://localhost:3000"

   UI_URL="http://localhost:3001"
   ```

6. **Jalankan migrasi database** untuk membuat tabel-tabel yang diperlukan:

   ```bash
   npm run db:generate
   ```

   ```bash
   npm run db:push
   ```

7. **Jalankan aplikasi dalam mode development**:

   ```bash
   npm run start:dev
   ```

   Aplikasi akan berjalan di http://localhost:3000

## Mulai Koding

### Alur Kerja

1. **Buat branch baru** dari branch `main` untuk fitur atau perbaikan yang akan Anda kerjakan:

   ```bash
   git checkout -b nama-fitur-atau-perbaikan
   ```

2. **Lakukan perubahan** yang diperlukan. Pastikan kode mengikuti standar yang sudah ditetapkan.

3. **Cek lint kode** Anda sebelum melakukan commit:

   ```bash
   npm run lint
   ```

4. **Commit perubahan** Anda dengan pesan yang jelas:

   ```bash
   git commit -m "feat: pesan commit"
   ```

5. **Push ke repositori fork** Anda:

   ```bash
   git push origin nama-fitur-atau-perbaikan
   ```

6. **Buat Pull Request** ke repositori utama.

### Standar Kode

- Gunakan TypeScript untuk semua file kode baru
- Ikuti pattern yang sudah ada di proyek (controller, service, module)
- Tambahkan validasi input yang tepat
- Berikan komentar untuk logika bisnis yang kompleks

### Conventional Commits

Proyek ini mengikuti [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) untuk format pesan commit. Format ini membantu dalam automasi changelog dan versioning.

#### Jenis Tipe yang Umum Digunakan

- `feat`: Menambahkan fitur baru
- `fix`: Memperbaiki bug
- `docs`: Perubahan dokumentasi
- `refactor`: Perubahan kode yang tidak menambah fitur atau memperbaiki bug
- `test`: Menambah atau memperbaiki test
- `chore`: Perubahan pada proses build, schema database, atau alat bantu

#### Contoh Pesan Commit

```bash
# Menambahkan fitur baru
git commit -m "feat(auth): add refresh token functionality"

# Memperbaiki bug
git commit -m "fix(pekerjaan): resolve validation error on empty input"

# Perubahan yang breaking
git commit -m "feat!: change API response structure"
```

Untuk informasi lebih lengkap, kunjungi [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/).

### Naming Convention

- Gunakan camelCase untuk variabel dan fungsi
- Gunakan PascalCase untuk class dan type/interface
- Gunakan kebab-case untuk file
- Gunakan snake_case untuk folder

## Pertanyaan Umum

<details>
   <summary>
      <h3>Bagaimana cara menambah endpoint baru?</h3>
   </summary>
   
   Untuk menambah endpoint baru:
   1. Buat schema database baru jika diperlukan
   2. Buat DTO (Data Transfer Object) untuk request
   3. Buat service untuk logika bisnis
   4. Buat controller untuk menangani HTTP requests
   5. Tambahkan module baru dan import di app.module.ts
   6. Tambahkan dokumentasi untuk endpoint baru menggunakan swagger
</details>

<!--<details>
   <summary>
      <h3>Bagaimana cara menjalankan test untuk endpoint tertentu?</h3>
   </summary>

   Untuk menjalankan test untuk file tertentu:
   ```bash
   npm run test -- pekerjaan.service.spec.ts
   ```

   Untuk menjalankan test dengan coverage:
   ```bash
   npm run test:cov
   ```
</details>-->

## Diskusi dan Bantuan

Jika Anda memiliki pertanyaan atau membutuhkan bantuan:

- Buka issue baru di GitHub untuk pertanyaan atau laporan bug
- Discord: @yasudahlah
