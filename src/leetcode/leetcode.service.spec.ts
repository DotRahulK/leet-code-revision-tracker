import { Test, TestingModule } from '@nestjs/testing';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeClient, GraphqlResponse } from './leetcode.client';
import { ProblemsService } from '../problems/problems.service';
import { UserProblemsService } from '../user-problems/user-problems.service';

describe('LeetcodeService', () => {
  let service: LeetcodeService;
  let client: LeetcodeClient;
  let problems: ProblemsService;
  let userProblems: UserProblemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeetcodeService,
        LeetcodeClient,
        {
          provide: ProblemsService,
          useValue: { createOrUpdateFromLcMeta: jest.fn() },
        },
        {
          provide: UserProblemsService,
          useValue: { updateCode: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(LeetcodeService);
    client = module.get(LeetcodeClient);
    problems = module.get(ProblemsService);
    userProblems = module.get(UserProblemsService);
  });

  it('maps recent submissions', async () => {
    const mockResponse: GraphqlResponse<{ recentAcSubmissionList: any[] }> = {
      data: {
        recentAcSubmissionList: [
          { id: '1', title: 'Two Sum', titleSlug: 'two-sum', timestamp: '100' },
        ],
      },
    };
    jest.spyOn(client, 'post').mockResolvedValue(mockResponse);
    const res = await service.getRecentAccepted('me', 1);
    expect(res).toEqual([
      { id: '1', title: 'Two Sum', titleSlug: 'two-sum', timestamp: 100 },
    ]);
  });

  it('syncRecentAccepted integrates services', async () => {
    jest
      .spyOn(service, 'getRecentAccepted')
      .mockResolvedValue([
        { id: '1', title: 'A', titleSlug: 'a', timestamp: 1 },
      ]);
    jest.spyOn(service, 'getQuestionDetail').mockResolvedValue({
      title: 'A',
      difficulty: 'Easy',
      topicTags: [{ name: 'tag', slug: 'tag' }],
      content: 'desc',
    });
    jest.spyOn(service, 'getSubmissionDetail').mockResolvedValue({
      id: '1',
      code: 'code',
      lang: 'ts',
      runtime: '1',
      memory: '1',
      statusDisplay: 'Accepted',
      timestamp: 1,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const createOrUpdate = problems.createOrUpdateFromLcMeta as jest.Mock;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const updateCode = userProblems.updateCode as jest.Mock;
    createOrUpdate.mockResolvedValue({
      problem: { id: 'p1', slug: 'a' },
      created: true,
    });
    updateCode.mockResolvedValue({ created: true });

    const summary = await service.syncRecentAccepted({
      username: 'me',
      limit: 1,
    });
    expect(createOrUpdate).toHaveBeenCalled();
    expect(updateCode).toHaveBeenCalled();
    expect(summary).toEqual({
      created: 1,
      updated: 0,
      failures: 0,
      items: ['a'],
    });
  });
});
