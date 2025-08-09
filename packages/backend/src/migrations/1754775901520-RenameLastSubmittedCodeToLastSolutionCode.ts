import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameLastSubmittedCodeToLastSolutionCode1754775901520
  implements MigrationInterface
{
  name = 'RenameLastSubmittedCodeToLastSolutionCode1754775901520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_problem" RENAME COLUMN "lastSubmittedCode" TO "lastSolutionCode"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_problem" RENAME COLUMN "lastSolutionCode" TO "lastSubmittedCode"`,
    );
  }
}
