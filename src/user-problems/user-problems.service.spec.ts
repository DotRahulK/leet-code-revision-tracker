import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProblemsService } from './user-problems.service';
import { SchedulerService } from './scheduler.service';
import { UserProblem } from './entities/user-problem.entity';
import { Problem } from '../problems/problem.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

describe('UserProblemsService', () => {
  let service: UserProblemsService;
  let userProblemRepo: jest.Mocked<Repository<UserProblem>>;
  let problemRepo: jest.Mocked<Repository<Problem>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let scheduler: SchedulerService;

  beforeEach(async () => {
    userProblemRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;
    problemRepo = { findOne: jest.fn() } as any;
    userRepo = { findOne: jest.fn() } as any;
    scheduler = { scheduleNextReview: jest.fn() } as any;

    const module = await Test.createTestingModule({
      providers: [
        UserProblemsService,
        { provide: getRepositoryToken(UserProblem), useValue: userProblemRepo },
        { provide: getRepositoryToken(Problem), useValue: problemRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: SchedulerService, useValue: scheduler },
      ],
    }).compile();

    service = module.get(UserProblemsService);
  });

  it('should link problem to user when missing', async () => {
    userProblemRepo.findOne.mockResolvedValue(null);
    const problem = { id: 'p1' } as Problem;
    const user = { id: 'u1' } as User;
    problemRepo.findOne.mockResolvedValue(problem);
    userRepo.findOne.mockResolvedValue(user);
    const created = { id: 'up1', problem, user } as UserProblem;
    userProblemRepo.create.mockReturnValue(created);
    userProblemRepo.save.mockResolvedValue(created);

    const result = await service.linkProblemToUser('p1', 'u1');
    expect(userProblemRepo.save).toHaveBeenCalledWith(created);
    expect(result).toBe(created);
  });

  it('should update notes', async () => {
    const userProblem = { id: 'up', notes: null } as UserProblem;
    userProblemRepo.findOne.mockResolvedValue(userProblem);
    userProblemRepo.save.mockResolvedValue(userProblem);
    const result = await service.updateNotes('up', 'note');
    expect(userProblem.notes).toBe('note');
    expect(result).toBe(userProblem);
  });

  it('should update code', async () => {
    const userProblem = { id: 'up', lastSolutionCode: null } as UserProblem;
    userProblemRepo.findOne.mockResolvedValue(userProblem);
    userProblemRepo.save.mockResolvedValue(userProblem);
    const result = await service.updateCode('up', 'code');
    expect(userProblem.lastSolutionCode).toBe('code');
    expect(result).toBe(userProblem);
  });

  it('should rate recall and update scheduling', async () => {
    const userProblem = {
      id: 'up',
      interval: 0,
      repetition: 0,
      easinessFactor: 2.5,
    } as UserProblem;
    userProblemRepo.findOne.mockResolvedValue(userProblem);
    const scheduled = {
      interval: 1,
      repetition: 1,
      easinessFactor: 2.6,
      nextReviewAt: new Date(),
    };
    (scheduler.scheduleNextReview as jest.Mock).mockReturnValue(scheduled);
    userProblemRepo.save.mockResolvedValue(userProblem);

    const result = await service.rateRecall('up', 5);
    expect(result.interval).toBe(1);
    expect(result.repetition).toBe(1);
    expect(result.easinessFactor).toBe(2.6);
    expect(userProblemRepo.save).toHaveBeenCalledWith(userProblem);
  });
});
