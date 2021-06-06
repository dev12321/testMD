alter table "public"."attempts" alter column "user_id" drop not null;
alter table "public"."attempts" add column "user_id" uuid;
