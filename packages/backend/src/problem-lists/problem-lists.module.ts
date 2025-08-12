import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemList } from './problem-list.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import { ProblemListsService } from './problem-lists.service';
import { ProblemListsController } from './problem-lists.controller';
import { CustomListsController } from './custom-lists.controller';
import { UserProblemsModule } from '../user-problems/user-problems.module';
import { Problem } from '../problems/problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProblemList, ProblemListItem, Problem]),
    UserProblemsModule,
  ],
  providers: [ProblemListsService],
  controllers: [ProblemListsController, CustomListsController],
  exports: [ProblemListsService],
})
export class ProblemListsModule {}

