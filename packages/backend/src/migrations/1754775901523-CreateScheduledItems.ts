import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScheduledItems1754775901523 implements MigrationInterface {
  name = 'CreateScheduledItems1754775901523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "scheduled_item" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" character varying NOT NULL,
        "userId" uuid,
        "problemId" uuid NOT NULL,
        "listId" uuid,
        "dueAt" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'PLANNED',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_scheduled_item_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "scheduled_item" ADD CONSTRAINT "FK_scheduled_item_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "scheduled_item" ADD CONSTRAINT "FK_scheduled_item_problem" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "scheduled_item" ADD CONSTRAINT "FK_scheduled_item_list" FOREIGN KEY ("listId") REFERENCES "problem_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scheduled_item" DROP CONSTRAINT "FK_scheduled_item_list"`);
    await queryRunner.query(`ALTER TABLE "scheduled_item" DROP CONSTRAINT "FK_scheduled_item_problem"`);
    await queryRunner.query(`ALTER TABLE "scheduled_item" DROP CONSTRAINT "FK_scheduled_item_user"`);
    await queryRunner.query(`DROP TABLE "scheduled_item"`);
  }
}
