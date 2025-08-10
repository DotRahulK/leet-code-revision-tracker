import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProblem } from './entities/user-problem.entity';
import { Problem } from '../problems/problem.entity';
import { User } from '../users/user.entity';
import { SchedulerService } from './scheduler.service';

@Injectable()
export class UserProblemsService {
  private readonly logger = new Logger(UserProblemsService.name);
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
    this.logger.debug(
      `Fetching due reviews${userId ? ` for user ${userId}` : ''}`,
    );
    const qb = this.userProblemRepo
      .createQueryBuilder('userProblem')
      .leftJoinAndSelect('userProblem.problem', 'problem')
      .where('userProblem.nextReviewAt IS NOT NULL')
      .andWhere('userProblem.nextReviewAt <= CURRENT_DATE');

    if (userId) {
      qb.andWhere('userProblem.userId = :userId', { userId });
    }

    const results = await qb
      .orderBy('userProblem.nextReviewAt', 'ASC')
      .getMany();
    this.logger.debug(`Found ${results.length} due reviews`);
    return results;
  }

  async rateRecall(id: string, quality: number): Promise<UserProblem> {
    this.logger.debug(`Rating recall for ${id} with quality ${quality}`);
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
    this.logger.debug(
      `Updated scheduling for ${id} -> nextReviewAt ${userProblem.nextReviewAt?.toISOString()}`,
    );
    return userProblem;
  }

  async updateNotes(id: string, notes: string): Promise<UserProblem> {
    this.logger.debug(`Updating notes for ${id}`);
    const userProblem = await this.userProblemRepo.findOne({ where: { id } });
    if (!userProblem) {
      throw new NotFoundException('UserProblem not found');
    }
    userProblem.notes = notes;
    await this.userProblemRepo.save(userProblem);
    this.logger.debug(`Saved notes for ${id}`);
    return userProblem;
  }

  async updateCode(id: string, code: string): Promise<UserProblem> {
    this.logger.debug(`Updating code for ${id}`);
    const userProblem = await this.userProblemRepo.findOne({ where: { id } });
    if (!userProblem) {
      throw new NotFoundException('UserProblem not found');
    }
    userProblem.lastSolutionCode = code;
    await this.userProblemRepo.save(userProblem);
    this.logger.debug(`Saved code for ${id}`);
    return userProblem;
  }

  async linkProblemToUser(
    problemId: string,
    userId?: string,
  ): Promise<UserProblem> {
    const where: any = { problem: { id: problemId } };
    if (userId) {
      where.user = { id: userId };
    } else {
      where.user = null;
    }

    this.logger.debug(
      `Linking problem ${problemId} to ${userId ? `user ${userId}` : 'global pool'}`,
    );
    let userProblem = await this.userProblemRepo.findOne({ where });
    if (userProblem) {
      this.logger.debug(
        'UserProblem already linked, returning existing record',
      );
      return userProblem;
    }

    const problem = await this.problemRepo.findOne({
      where: { id: problemId },
    });
    if (!problem) {
      this.logger.warn(`Problem ${problemId} not found`);
      throw new NotFoundException('Problem not found');
    }

    let user: User | null = null;
    if (userId) {
      user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        this.logger.warn(`User ${userId} not found`);
        throw new NotFoundException('User not found');
      }
    }

    userProblem = this.userProblemRepo.create({
      problem,
      user: user ?? undefined,
      interval: 1,
    });
    const saved = await this.userProblemRepo.save(userProblem);
    this.logger.debug(
      `Linked problem ${problemId} to ${userId ? `user ${userId}` : 'global pool'}`,
    );
    return saved;
  }
}
