alter table "public"."attempts"
  add constraint "attempts_user_email_fkey"
  foreign key ("user_email")
  references "public"."users"
  ("email") on update restrict on delete restrict;
