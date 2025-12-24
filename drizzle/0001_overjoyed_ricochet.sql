CREATE TABLE "jenis_register" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_register" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jenis_register_jenis_register_unique" UNIQUE("jenis_register")
);
--> statement-breakpoint
CREATE TABLE "pekerjaan" (
	"id" text PRIMARY KEY NOT NULL,
	"nama_pekerjaan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pekerjaan_nama_pekerjaan_unique" UNIQUE("nama_pekerjaan")
);
--> statement-breakpoint
CREATE TABLE "pindah" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_pindah" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "register" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"warga_id" text NOT NULL,
	"pindah_id" text NOT NULL,
	"jenis_register_id" text NOT NULL,
	"keperluan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "register_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "warga" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nik" text NOT NULL,
	"nama_warga" text NOT NULL,
	"tempat_lahir" text NOT NULL,
	"tanggal_lahir" timestamp NOT NULL,
	"warganegara_id" text NOT NULL,
	"alamat" text NOT NULL,
	"pekerjaan_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "warga_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "warganegara" (
	"id" text PRIMARY KEY NOT NULL,
	"jenis_kebangsaan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "register" ADD CONSTRAINT "register_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "register" ADD CONSTRAINT "register_warga_id_warga_id_fk" FOREIGN KEY ("warga_id") REFERENCES "public"."warga"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "register" ADD CONSTRAINT "register_pindah_id_pindah_id_fk" FOREIGN KEY ("pindah_id") REFERENCES "public"."pindah"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "register" ADD CONSTRAINT "register_jenis_register_id_jenis_register_id_fk" FOREIGN KEY ("jenis_register_id") REFERENCES "public"."jenis_register"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warga" ADD CONSTRAINT "warga_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warga" ADD CONSTRAINT "warga_warganegara_id_warganegara_id_fk" FOREIGN KEY ("warganegara_id") REFERENCES "public"."warganegara"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warga" ADD CONSTRAINT "warga_pekerjaan_id_pekerjaan_id_fk" FOREIGN KEY ("pekerjaan_id") REFERENCES "public"."pekerjaan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");