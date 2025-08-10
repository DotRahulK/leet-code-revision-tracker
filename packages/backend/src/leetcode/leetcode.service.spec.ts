import { Test } from '@nestjs/testing';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeClient } from './leetcode.client';
import { ProblemsService } from '../problems/problems.service';
import { UserProblemsService } from '../user-problems/user-problems.service';
import { LEETCODE_CONFIG } from './leetcode.config';

describe('LeetcodeService', () => {
  let service: LeetcodeService;
  let client: { post: jest.Mock };
  let problems: { findBySlug: jest.Mock; createOrUpdateFromLcMeta: jest.Mock };
  let userProblems: { linkProblemToUser: jest.Mock; updateCode: jest.Mock };

  beforeEach(async () => {
    client = { post: jest.fn() };
    problems = { findBySlug: jest.fn(), createOrUpdateFromLcMeta: jest.fn() };
    userProblems = { linkProblemToUser: jest.fn(), updateCode: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        LeetcodeService,
        { provide: LeetcodeClient, useValue: client },
        { provide: ProblemsService, useValue: problems },
        { provide: UserProblemsService, useValue: userProblems },
        { provide: LEETCODE_CONFIG, useValue: { username: 'me', pageSize: 20 } },
      ],
    }).compile();

    service = module.get(LeetcodeService);
  });

  it('getRecentAccepted maps fields correctly', async () => {
    client.post.mockResolvedValue({
      data: {
        recentAcSubmissionList: [
          { id: 1, title: 'Two Sum', titleSlug: 'two-sum', timestamp: '123' },
        ],
      },
    });
    const result = await service.getRecentAccepted('me', 1);
    expect(result).toEqual([
      { id: '1', title: 'Two Sum', titleSlug: 'two-sum', timestamp: 123 },
    ]);
  });

  it('syncRecentAccepted upserts and updates code', async () => {
    client.post
      .mockResolvedValueOnce({
        data: {
          recentAcSubmissionList: [
            { id: 1, title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1' },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          question: {
            title: 'Two Sum',
            difficulty: 'Easy',
            topicTags: [],
            content: '',
          },
        },
      })
      .mockResolvedValueOnce({
        data: { submissionDetail: { statusDisplay: 'Accepted', code: 'code' } },
      });
    problems.findBySlug.mockResolvedValue(null);
    problems.createOrUpdateFromLcMeta.mockResolvedValue({ id: 'p1' });
    userProblems.linkProblemToUser.mockResolvedValue({ id: 'up1', interval: 1, repetition: 0 });
    userProblems.updateCode.mockResolvedValue({});

    const res = await service.syncRecentAccepted({ username: 'me', limit: 1 });
    expect(problems.createOrUpdateFromLcMeta).toHaveBeenCalled();
    expect(userProblems.updateCode).toHaveBeenCalledWith('up1', 'code');
    expect(res).toEqual({ created: 1, updated: 0, failures: 0, items: ['two-sum'] });
  });

  it('syncRecentAccepted counts failures', async () => {
    client.post
      .mockResolvedValueOnce({
        data: {
          recentAcSubmissionList: [
            { id: 1, title: 'Two Sum', titleSlug: 'two-sum', timestamp: '1' },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          question: {
            title: 'Two Sum',
            difficulty: 'Easy',
            topicTags: [],
            content: '',
          },
        },
      })
      .mockResolvedValueOnce({
        data: { submissionDetail: { statusDisplay: 'Wrong Answer', code: 'code' } },
      });
    problems.findBySlug.mockResolvedValue(null);
    problems.createOrUpdateFromLcMeta.mockResolvedValue({ id: 'p1' });
    userProblems.linkProblemToUser.mockResolvedValue({ id: 'up1', interval: 1, repetition: 0 });
    userProblems.updateCode.mockResolvedValue({});

    const res = await service.syncRecentAccepted({ username: 'me', limit: 1 });
    expect(res.failures).toBe(1);
  });
});
