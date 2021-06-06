alter table "public"."appeal" add column "created_at" timestamptz
 null default now();
