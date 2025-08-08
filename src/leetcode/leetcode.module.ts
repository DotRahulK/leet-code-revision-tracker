import { Module } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeController } from './leetcode.controller';
import { LeetcodeClient } from './leetcode.client';
import { loadLeetcodeConfig, LEETCODE_CONFIG } from './leetcode.config';
import { ProblemsModule } from '../problems/problems.module';
import { UserProblemsModule } from '../user-problems/user-problems.module';

@Module({
  imports: [ProblemsModule, UserProblemsModule],
  providers: [
    LeetcodeService,
    LeetcodeClient,
    { provide: LEETCODE_CONFIG, useFactory: loadLeetcodeConfig },
  ],
  controllers: [LeetcodeController],
  exports: [LeetcodeService],
})
export class LeetcodeModule {}
