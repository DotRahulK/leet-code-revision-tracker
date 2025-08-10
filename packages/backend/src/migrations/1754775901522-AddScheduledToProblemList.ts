import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduledToProblemList1754775901522 implements MigrationInterface {
  name = 'AddScheduledToProblemList1754775901522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "problem_list" ADD "scheduled" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "problem_list" DROP COLUMN "scheduled"`
    );
  }
}
