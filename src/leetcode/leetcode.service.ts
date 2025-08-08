import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LeetcodeClient } from './leetcode.client';
import { ProblemsService } from '../problems/problems.service';
import { UserProblemsService } from '../user-problems/user-problems.service';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RecentSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: number;
}

interface SubmissionDetail {
  id: string;
  code: string;
  lang: string;
  runtime: string;
  memory: string;
  statusDisplay: string;
  timestamp: number;
}

interface QuestionDetail {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTags: { name: string; slug: string }[];
  content: string;
}

const recentAcSubmissionsQuery = readFileSync(
  join(__dirname, 'graphql', 'recentAcSubmissions.graphql'),
  'utf8',
);
const submissionDetailQuery = readFileSync(
  join(__dirname, 'graphql', 'submissionDetail.graphql'),
  'utf8',
);
const questionDetailQuery = readFileSync(
  join(__dirname, 'graphql', 'questionDetail.graphql'),
  'utf8',
);

@Injectable()
export class LeetcodeService {
  private readonly defaultUsername = process.env.LC_USERNAME || '';
  private readonly pageSize = Number(process.env.LC_PAGE_SIZE || 20);

  constructor(
    private readonly client: LeetcodeClient,
    private readonly problemsService: ProblemsService,
    private readonly userProblemsService: UserProblemsService,
  ) {}

  async getRecentAccepted(
    username: string,
    limit = this.pageSize,
  ): Promise<RecentSubmission[]> {
    const res = await this.client.post<{
      recentAcSubmissionList: RecentSubmission[];
    }>(recentAcSubmissionsQuery, { username, limit });
    return (res.data.recentAcSubmissionList || []).map((s) => ({
      id: s.id,
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: Number(s.timestamp),
    }));
  }

  async getSubmissionDetail(submissionId: string): Promise<SubmissionDetail> {
    const res = await this.client.post<{ submissionDetail: SubmissionDetail }>(
      submissionDetailQuery,
      { submissionId },
    );
    const d = res.data.submissionDetail;
    return {
      id: d.id,
      code: d.code,
      lang: d.lang,
      runtime: d.runtime,
      memory: d.memory,
      statusDisplay: d.statusDisplay,
      timestamp: Number(d.timestamp),
    };
  }

  async getQuestionDetail(slug: string): Promise<QuestionDetail> {
    const res = await this.client.post<{ question: QuestionDetail }>(
      questionDetailQuery,
      { titleSlug: slug },
    );
    const q = res.data.question;
    return {
      title: q.title,
      difficulty: q.difficulty,
      topicTags: q.topicTags || [],
      content: q.content,
    };
  }

  async syncRecentAccepted(params: {
    username?: string;
    limit?: number;
  }): Promise<{
    created: number;
    updated: number;
    failures: number;
    items: string[];
  }> {
    const username = params.username || this.defaultUsername;
    const limit = params.limit || this.pageSize;
    const recent = await this.getRecentAccepted(username, limit);
    const seen = new Set<string>();
    const summary = {
      created: 0,
      updated: 0,
      failures: 0,
      items: [] as string[],
    };

    for (const item of recent) {
      if (seen.has(item.titleSlug)) continue;
      seen.add(item.titleSlug);
      try {
        const [question, submission] = await Promise.all([
          this.getQuestionDetail(item.titleSlug),
          this.getSubmissionDetail(item.id),
        ]);
        if (submission.statusDisplay !== 'Accepted') {
          summary.failures++;
          continue;
        }
        const existing = await this.problemsService.findBySlug(item.titleSlug);
        const problem = await this.problemsService.createOrUpdateFromLcMeta({
          title: question.title,
          slug: item.titleSlug,
          difficulty: question.difficulty,
          tags: question.topicTags.map((t) => t.name),
          description: question.content,
        });
        const res2 = await this.userProblemsService.updateCodeForProblem(
          problem,
          submission.code,
        );
        if (!existing || res2.created) {
          summary.created++;
        } else {
          summary.updated++;
        }
        summary.items.push(problem.slug);
      } catch {
        summary.failures++;
      }
      await delay(150);
    }
    return summary;
  }
}
