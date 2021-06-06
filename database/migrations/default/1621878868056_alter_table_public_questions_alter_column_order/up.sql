alter table "public"."questions" alter column "order" drop default;
alter table "public"."questions" alter column "order" drop not null;
