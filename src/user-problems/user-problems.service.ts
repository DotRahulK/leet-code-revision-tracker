import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProblem } from './user-problem.entity';
import { Problem } from '../problems/problem.entity';

@Injectable()
export class UserProblemsService {
  constructor(
    @InjectRepository(UserProblem)
    private readonly repo: Repository<UserProblem>,
  ) {}

  async updateCode(
    problem: Problem,
    code: string,
  ): Promise<{ userProblem: UserProblem; created: boolean }> {
    let userProblem = await this.repo.findOne({
      where: { problem: { id: problem.id } },
      relations: ['problem'],
    });
    const created = !userProblem;
    if (!userProblem) {
      userProblem = this.repo.create({
        problem,
        easinessFactor: 2.5,
        repetition: 0,
        interval: 1,
        nextReviewAt: null,
        lastSubmittedCode: code,
      });
    } else {
      userProblem.lastSubmittedCode = code;
    }
    userProblem = await this.repo.save(userProblem);
    return { userProblem, created };
  }
}
