import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToUserProblem1754775901521
  implements MigrationInterface
{
  name = 'AddTimestampsToUserProblem1754775901521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_problem" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now(), ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_problem" DROP COLUMN "createdAt", DROP COLUMN "updatedAt"`,
    );
  }
}
