import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProblem } from './entities/user-problem.entity';
import { Problem } from '../problems/problem.entity';
import { User } from '../users/user.entity';
import { SchedulerService } from './scheduler.service';

@Injectable()
export class UserProblemsService {
  constructor(
    @InjectRepository(UserProblem)
    private readonly userProblemRepo: Repository<UserProblem>,
    @InjectRepository(Problem)
    private readonly problemRepo: Repository<Problem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly scheduler: SchedulerService,
  ) {}

  async getDueReviews(userId?: string): Promise<UserProblem[]> {
    const qb = this.userProblemRepo
      .createQueryBuilder('userProblem')
      .leftJoinAndSelect('userProblem.problem', 'problem')
      .where('userProblem.nextReviewAt IS NOT NULL')
      .andWhere('userProblem.nextReviewAt <= CURRENT_DATE');

    if (userId) {
      qb.andWhere('userProblem.userId = :userId', { userId });
    }

    return qb.orderBy('userProblem.nextReviewAt', 'ASC').getMany();
  }

  async rateRecall(id: string, quality: number): Promise<UserProblem> {
    if (quality < 0 || quality > 5) {
      throw new BadRequestException('Quality must be between 0 and 5');
    }
    const userProblem = await this.userProblemRepo.findOne({ where: { id } });
    if (!userProblem) {
      throw new NotFoundException('UserProblem not found');
    }

    const result = this.scheduler.scheduleNextReview(
      {
        interval: userProblem.interval,
        repetition: userProblem.repetition,
        easinessFactor: userProblem.easinessFactor,
      },
      quality,
    );

    userProblem.interval = result.interval;
    userProblem.repetition = result.repetition;
    userProblem.easinessFactor = result.easinessFactor;
    userProblem.nextReviewAt = result.nextReviewAt;

    await this.userProblemRepo.save(userProblem);
    return userProblem;
  }

  async updateNotes(id: string, notes: string): Promise<UserProblem> {
    const userProblem = await this.userProblemRepo.findOne({ where: { id } });
    if (!userProblem) {
      throw new NotFoundException('UserProblem not found');
    }
    userProblem.notes = notes;
    await this.userProblemRepo.save(userProblem);
    return userProblem;
  }

  async updateCode(id: string, code: string): Promise<UserProblem> {
    const userProblem = await this.userProblemRepo.findOne({ where: { id } });
    if (!userProblem) {
      throw new NotFoundException('UserProblem not found');
    }
    userProblem.lastSolutionCode = code;
    await this.userProblemRepo.save(userProblem);
    return userProblem;
  }

  async linkProblemToUser(problemId: string, userId?: string): Promise<UserProblem> {
    const where: any = { problem: { id: problemId } };
    if (userId) {
      where.user = { id: userId };
    } else {
      where.user = null;
    }

    let userProblem = await this.userProblemRepo.findOne({ where });
    if (userProblem) {
      return userProblem;
    }

    const problem = await this.problemRepo.findOne({ where: { id: problemId } });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    let user: User | null = null;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    userProblem = this.userProblemRepo.create({ problem, user: user ?? undefined });
    return this.userProblemRepo.save(userProblem);
  }
}
