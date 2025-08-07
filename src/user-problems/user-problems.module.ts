import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProblem } from './entities/user-problem.entity';
import { Problem } from '../problems/problem.entity';
import { User } from '../users/user.entity';
import { UserProblemsService } from './user-problems.service';
import { UserProblemsController } from './user-problems.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProblem, Problem, User])],
  providers: [UserProblemsService, SchedulerService],
  controllers: [UserProblemsController],
  exports: [UserProblemsService],
})
export class UserProblemsModule {}
