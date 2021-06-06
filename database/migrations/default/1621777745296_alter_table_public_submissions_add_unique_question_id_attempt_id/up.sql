alter table "public"."submissions" add constraint "submissions_question_id_attempt_id_key" unique ("question_id", "attempt_id");
