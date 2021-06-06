alter table "public"."tests" add column "created_at" timestamptz
 null default now();
