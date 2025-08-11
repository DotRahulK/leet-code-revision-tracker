import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemList } from './problem-list.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import { ProblemListsService } from './problem-lists.service';
import { ProblemListsController } from './problem-lists.controller';
import { UserProblemsModule } from '../user-problems/user-problems.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProblemList, ProblemListItem]),
    UserProblemsModule,
  ],
  providers: [ProblemListsService],
  controllers: [ProblemListsController],
  exports: [ProblemListsService],
})
export class ProblemListsModule {}

