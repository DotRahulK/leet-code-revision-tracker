import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProblem } from './user-problem.entity';
import { UserProblemsService } from './user-problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProblem])],
  providers: [UserProblemsService],
  exports: [UserProblemsService],
})
export class UserProblemsModule {}
