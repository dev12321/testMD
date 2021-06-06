-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "fullName" varchar,
  "email" varchar NOT NULL,
  "type" varchar NOT NULL DEFAULT 'student'
);

CREATE TABLE "tests" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "title" varchar NOT NULL,
  "duration" integer,
  "instructions" text,
  "created_by" uuid NOT NULL
);

CREATE TABLE "questions" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "test_id" uuid NOT NULL,
  "title" varchar NOT NULL,
  "is_multiple" boolean NOT NULL DEFAULT false,
  "options" jsonb NOT NULL DEFAULT (jsonb_build_array()),
  "answer" int NOT NULL
);

CREATE TABLE "attempts" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "test_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "marked_malpractice" boolean NOT NULL DEFAULT false,
  "status" varchar NOT NULL DEFAULT 'NA',
  "expiry_date" timestamp
);

CREATE TABLE "submissions" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "question_id" uuid NOT NULL,
  "attempt_id" uuid NOT NULL,
  "answer" int NOT NULL,
  "status" varchar NOT NULL DEFAULT 'NA'
);

CREATE TABLE "malpractice_logs" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "type" varchar NOT NULL,
  "desc" varchar,
  "data" jsonb NOT NULL DEFAULT (jsonb_build_object()),
  "attempt_id" uuid NOT NULL
);

CREATE TABLE "appeal" (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "attempt_id" uuid NOT NULL,
  "message" text NOT NULL,
  "resoponse" text,
  "status" varchar NOT NULL DEFAULT 'NA'
);

ALTER TABLE "tests" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "questions" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id");

ALTER TABLE "attempts" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id");

ALTER TABLE "attempts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "submissions" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id");

ALTER TABLE "submissions" ADD FOREIGN KEY ("attempt_id") REFERENCES "attempts" ("id");

ALTER TABLE "malpractice_logs" ADD FOREIGN KEY ("attempt_id") REFERENCES "attempts" ("id");

ALTER TABLE "appeal" ADD FOREIGN KEY ("attempt_id") REFERENCES "attempts" ("id");
