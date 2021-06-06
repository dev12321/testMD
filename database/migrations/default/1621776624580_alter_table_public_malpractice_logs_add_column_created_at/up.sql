alter table "public"."malpractice_logs" add column "created_at" timestamptz
 null default now();
