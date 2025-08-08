import { Inject, Injectable } from '@nestjs/common';
import { ProblemsService } from '../problems/problems.service';
import { UserProblemsService } from '../user-problems/user-problems.service';
import { LeetcodeClient } from './leetcode.client';
import { LEETCODE_CONFIG, type LeetcodeConfig } from './leetcode.config';
import * as fs from 'fs';
import * as path from 'path';

const recentAcSubmissionsQuery = fs.readFileSync(
  path.join(__dirname, 'graphql/recentAcSubmissions.graphql'),
  'utf8',
);
const submissionDetailQuery = fs.readFileSync(
  path.join(__dirname, 'graphql/submissionDetail.graphql'),
  'utf8',
);
const questionDetailQuery = fs.readFileSync(
  path.join(__dirname, 'graphql/questionDetail.graphql'),
  'utf8',
);

export interface RecentAcceptedItem {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: number;
}

@Injectable()
export class LeetcodeService {
  constructor(
    private readonly client: LeetcodeClient,
    private readonly problemsService: ProblemsService,
    private readonly userProblemsService: UserProblemsService,
    @Inject(LEETCODE_CONFIG)
    private readonly config: LeetcodeConfig,
  ) {}

  getDefaultUsername() {
    return this.config.username;
  }

  getDefaultPageSize() {
    return this.config.pageSize;
  }

  async getRecentAccepted(username: string, limit = this.config.pageSize) {
    const res = await this.client.post<{ data: { recentAcSubmissionList: any[] } }>(
      recentAcSubmissionsQuery,
      { username, limit },
    );
    return res.data.recentAcSubmissionList.map((s) => ({
      id: String(s.id),
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: Number(s.timestamp),
    })) as RecentAcceptedItem[];
  }

  async getSubmissionDetail(submissionId: string) {
    const res = await this.client.post<{ data: { submissionDetail: any } }>(
      submissionDetailQuery,
      { submissionId },
    );
    return res.data.submissionDetail;
  }

  async getQuestionDetail(slug: string) {
    const res = await this.client.post<{ data: { question: any } }>(
      questionDetailQuery,
      { titleSlug: slug },
    );
    return res.data.question;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async syncRecentAccepted({
    username,
    limit,
  }: {
    username?: string;
    limit?: number;
  }): Promise<{ created: number; updated: number; failures: number; items: string[] }> {
    const user = username || this.config.username;
    const lim = limit ?? this.config.pageSize;
    const recent = await this.getRecentAccepted(user, lim);
    const dedupedMap = new Map<string, RecentAcceptedItem>();
    for (const r of recent) {
      dedupedMap.set(r.titleSlug, r);
    }
    const deduped = Array.from(dedupedMap.values());

    let created = 0;
    let updated = 0;
    let failures = 0;
    const items: string[] = [];

    for (const item of deduped) {
      await this.delay(150);
      try {
        const question = await this.getQuestionDetail(item.titleSlug);
        const exists = await this.problemsService.findBySlug(item.titleSlug);
        const problem = await this.problemsService.createOrUpdateFromLcMeta({
          slug: item.titleSlug,
          title: question.title,
          difficulty: question.difficulty,
          tags: (question.topicTags || []).map((t) => t.name),
          description: question.content,
        });
        if (exists) {
          updated++;
        } else {
          created++;
        }

        const submission = await this.getSubmissionDetail(item.id);
        if (submission.statusDisplay !== 'Accepted') {
          throw new Error('Submission not accepted');
        }
        const userProblem = await this.userProblemsService.linkProblemToUser(problem.id);
        if (userProblem.interval === 0 && userProblem.repetition === 0) {
          userProblem.interval = 1;
        }
        await this.userProblemsService.updateCode(userProblem.id, submission.code);
        items.push(item.titleSlug);
      } catch (e) {
        failures++;
      }
    }

    return { created, updated, failures, items };
  }
}
