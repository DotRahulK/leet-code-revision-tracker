import { Module } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeController } from './leetcode.controller';
import { LeetcodeClient } from './leetcode.client';
import { ProblemsModule } from '../problems/problems.module';
import { UserProblemsModule } from '../user-problems/user-problems.module';

@Module({
  imports: [ProblemsModule, UserProblemsModule],
  providers: [LeetcodeService, LeetcodeClient],
  controllers: [LeetcodeController],
  exports: [LeetcodeService],
})
export class LeetcodeModule {}
