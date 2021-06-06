alter table "public"."attempts" add column "created_at" timestamptz
 null default now();
