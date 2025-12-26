## Aplikasi Pendataan Desa Backend

<!-- ![Contoh Gambar](/contoh-gambar.png) -->

Aplikasi ini dibangun untuk mendukung sistem informasi pengelolaan data desa. Aplikasi ini menyediakan endpoint untuk manajemen data warga, registrasi peristiwa kependudukan, dan administrasi desa lainnya.

> [!NOTE]
> Backend API untuk aplikasi Pendataan Desa yang dibangun dengan Nest.js, dirancang untuk terintegrasi dengan Frontend. Repository ini cocok sebagai referensi pembelajaran untuk memahami cara membuat REST API Backend yang modern dengan struktur yang terorganisir.

## Fitur

- Sistem Autentikasi & Manajemen User: Sistem login dengan role-based access control
- Manajemen Data Penduduk: CRUD data warga dengan informasi lengkap
- Database Referensi
- Sistem Registrasi/Pencatatan Peristiwa
- Dashboard Analytics: Data statistik kependudukan

Selain fitur-fitur di atas, Anda juga bisa menambahkan fitur lainnya, jika mempunyai saran dan ide yang ada di benak Anda.

## Teknologi

Proyek ini dibangun menggunakan teknologi berikut:

| Kategori       | Nama                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| Backend        | [**Nest.js**](https://nestjs.com/)                                      |
| Database       | [**PostgreSQL**](https://www.postgresql.org/)                           |
| ORM            | [**Drizzle**](https://orm.drizzle.team/)                                |
| Authentication | [**Better Auth**](https://www.better-auth.com/docs/integrations/nestjs) |
| API Docs       | [**Swagger**](https://docs.nestjs.com/openapi/introduction)             |

## Dokumentasi API

Dokumentasi API lengkap dapat diakses melalui **Swagger UI** dengan mengunjungi endpoint berikut:

```
/api/docs
```

Dokumentasi ini menyediakan:
- Daftar lengkap endpoint yang tersedia
- Parameter request yang diperlukan
- Format response untuk setiap endpoint
- Kemampuan untuk mencoba endpoint langsung dari browser

## Kontribusi

Dengan senang hati, kami menyambut kontribusi dari siapa pun. Bantu kembangkan Aplikasi? silakan membaca [panduan kontribusi](https://github.com/IRTIDEATH/Pendataan-Desa-API/blob/main/CONTRIBUTING.md) untuk informasi lebih lanjut.

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan dengan lisensi yang sama dengan proyek ini (MIT).
Silakan membaca _file_ [LICENSE](https://github.com/IRTIDEATH/Pendataan-Desa-API/blob/main/LICENSE)

### Daftar Pustaka

- Pembuat - [IRTIDEATH](https://github.com/IRTIDEATH) dan para Kontributor keren.
- Setup README dan Contributing markdown ini mengikuti Repositori: [sensasi-apps/sensasi-pos](https://github.com/sensasi-apps/sensasi-pos)
