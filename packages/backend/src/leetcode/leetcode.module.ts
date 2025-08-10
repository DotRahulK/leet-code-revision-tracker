import { Module } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeController } from './leetcode.controller';
import { LeetcodeClient } from './leetcode.client';
import { loadLeetcodeConfig, LEETCODE_CONFIG } from './leetcode.config';
import { ProblemsModule } from '../problems/problems.module';
import { UserProblemsModule } from '../user-problems/user-problems.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemList } from '../problem-lists/problem-list.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';

@Module({
  imports: [
    ProblemsModule,
    UserProblemsModule,
    TypeOrmModule.forFeature([ProblemList, ProblemListItem]),
  ],
  providers: [
    LeetcodeService,
    LeetcodeClient,
    { provide: LEETCODE_CONFIG, useFactory: loadLeetcodeConfig },
  ],
  controllers: [LeetcodeController],
  exports: [LeetcodeService],
})
export class LeetcodeModule {}
