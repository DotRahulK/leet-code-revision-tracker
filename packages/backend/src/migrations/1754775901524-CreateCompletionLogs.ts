import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompletionLogs1754775901524 implements MigrationInterface {
  name = 'CreateCompletionLogs1754775901524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "completion_log" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid,
        "problemId" uuid NOT NULL,
        "ratedQuality" integer,
        "notes" text,
        "solutionCode" text,
        "timeTakenMinutes" integer,
        "referencesUsed" boolean NOT NULL DEFAULT false,
        "doneAt" TIMESTAMP NOT NULL DEFAULT now(),
        "source" character varying NOT NULL,
        CONSTRAINT "PK_completion_log_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "completion_log" ADD CONSTRAINT "FK_completion_log_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "completion_log" ADD CONSTRAINT "FK_completion_log_problem" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "completion_log" DROP CONSTRAINT "FK_completion_log_problem"`);
    await queryRunner.query(`ALTER TABLE "completion_log" DROP CONSTRAINT "FK_completion_log_user"`);
    await queryRunner.query(`DROP TABLE "completion_log"`);
  }
}
