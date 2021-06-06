-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE FUNCTION set_question_order()
  RETURNS trigger AS $BODY$
BEGIN
 IF NEW."order" IS NULL THEN
     NEW."order" = (SELECT count(1) FROM questions q where q."test_id" = NEW."test_id");
 END IF;
 RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

 CREATE TRIGGER
   set_question_order
 BEFORE INSERT ON
   questions
 FOR EACH ROW EXECUTE PROCEDURE
   set_question_order();
