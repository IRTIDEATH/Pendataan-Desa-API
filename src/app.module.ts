import { Module } from '@nestjs/common';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONNECTION } from './common/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { admin, bearer, openAPI } from 'better-auth/plugins';
import { PekerjaanModule } from './pekerjaan/pekerjaan.module';
import { ErrorFilter } from './common/error.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PekerjaanModule,
    AuthModule.forRootAsync({
      useFactory: (database: NodePgDatabase) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
          },
          plugins: [openAPI(), admin(), bearer()],
          user: {
            additionalFields: {
              role: {
                type: 'string',
                input: false,
              },
              premium: {
                type: 'boolean',
                input: false,
              },
            },
          },
          trustedOrigins: [`${process.env.UI_URL}`],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
