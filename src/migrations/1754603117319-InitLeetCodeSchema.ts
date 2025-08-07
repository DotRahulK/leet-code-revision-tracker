import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitLeetCodeSchema1754603117319 implements MigrationInterface {
  name = 'InitLeetCodeSchema1754603117319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "username" character varying NOT NULL, "email" character varying, CONSTRAINT "UQ_user_username" UNIQUE ("username"), CONSTRAINT "PK_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "problem" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "difficulty" character varying NOT NULL, "tags" text NOT NULL, "description" text, CONSTRAINT "UQ_problem_slug" UNIQUE ("slug"), CONSTRAINT "PK_problem_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "problem_list" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "source" character varying NOT NULL DEFAULT 'custom', "userId" uuid, CONSTRAINT "PK_problem_list_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_problem" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "easinessFactor" double precision NOT NULL DEFAULT '2.5', "repetition" integer NOT NULL DEFAULT '0', "interval" integer NOT NULL DEFAULT '1', "lastReviewedAt" TIMESTAMP, "nextReviewAt" TIMESTAMP, "lastRecallRating" integer, "lastSubmittedCode" text, "notes" text, "problemId" uuid, "userId" uuid, CONSTRAINT "PK_user_problem_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "problem_list_item" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "order" integer NOT NULL DEFAULT '0', "listId" uuid, "problemId" uuid, CONSTRAINT "PK_problem_list_item_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review_log" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "reviewedAt" TIMESTAMP NOT NULL DEFAULT now(), "recallRating" integer NOT NULL, "timeTakenInSeconds" integer, "comments" text, "userProblemId" uuid, CONSTRAINT "PK_review_log_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list" ADD CONSTRAINT "FK_problem_list_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_problem" ADD CONSTRAINT "FK_user_problem_problem" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_problem" ADD CONSTRAINT "FK_user_problem_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list_item" ADD CONSTRAINT "FK_problem_list_item_list" FOREIGN KEY ("listId") REFERENCES "problem_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list_item" ADD CONSTRAINT "FK_problem_list_item_problem" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_log" ADD CONSTRAINT "FK_review_log_user_problem" FOREIGN KEY ("userProblemId") REFERENCES "user_problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review_log" DROP CONSTRAINT "FK_review_log_user_problem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list_item" DROP CONSTRAINT "FK_problem_list_item_problem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list_item" DROP CONSTRAINT "FK_problem_list_item_list"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_problem" DROP CONSTRAINT "FK_user_problem_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_problem" DROP CONSTRAINT "FK_user_problem_problem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "problem_list" DROP CONSTRAINT "FK_problem_list_user"`,
    );
    await queryRunner.query(`DROP TABLE "review_log"`);
    await queryRunner.query(`DROP TABLE "problem_list_item"`);
    await queryRunner.query(`DROP TABLE "user_problem"`);
    await queryRunner.query(`DROP TABLE "problem_list"`);
    await queryRunner.query(`DROP TABLE "problem"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
