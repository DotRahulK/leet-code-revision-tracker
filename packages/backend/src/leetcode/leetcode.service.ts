import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';
import { ProblemsService } from '../problems/problems.service';
import { UserProblemsService } from '../user-problems/user-problems.service';
import { LeetcodeClient } from './leetcode.client';
import { LEETCODE_CONFIG, type LeetcodeConfig } from './leetcode.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemList } from '../problem-lists/problem-list.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';

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

type LCQuestion = { titleSlug: string };
type LCResponse = {
  data?: {
    problemsetQuestionList?: {
      total?: number;
      questions?: LCQuestion[];
    };
  };
};

const PROBLEMSET_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      titleSlug
    }
  }
}
`;

export interface RecentAcceptedItem {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: number;
}

@Injectable()
export class LeetcodeService {
  private readonly logger = new Logger(LeetcodeService.name);
  constructor(
    private readonly client: LeetcodeClient,
    private readonly problemsService: ProblemsService,
    private readonly userProblemsService: UserProblemsService,
    @Inject(LEETCODE_CONFIG)
    private readonly config: LeetcodeConfig,
    @InjectRepository(ProblemList)
    private readonly listRepo: Repository<ProblemList>,
    @InjectRepository(ProblemListItem)
    private readonly listItemRepo: Repository<ProblemListItem>,
    private readonly http: HttpService,
  ) {}

  getDefaultUsername() {
    return this.config.username;
  }

  getDefaultPageSize() {
    return this.config.pageSize;
  }

  async getRecentAccepted(username: string, limit = this.config.pageSize) {
    this.logger.debug(`Fetching recent accepted submissions for ${username}`);
    const res = await this.client.post<{
      data: { recentAcSubmissionList: any[] };
    }>(recentAcSubmissionsQuery, { username, limit });
    const items = res.data.recentAcSubmissionList.map((s) => ({
      id: String(s.id),
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: Number(s.timestamp),
    })) as RecentAcceptedItem[];
    this.logger.debug(`Retrieved ${items.length} submissions`);
    return items;
  }

  async getSubmissionDetail(submissionId: string) {
    this.logger.debug(`Fetching submission detail for ${submissionId}`);
    const res = await this.client.post<{ data: { submissionDetail: any } }>(
      submissionDetailQuery,
      { submissionId },
    );
    return res.data.submissionDetail;
  }

  async getQuestionDetail(slug: string) {
    this.logger.debug(`Fetching question detail for ${slug}`);
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
  }): Promise<{
    created: number;
    updated: number;
    failures: number;
    items: string[];
  }> {
    const user = username || this.config.username;
    const lim = limit ?? this.config.pageSize;
    this.logger.log(`Syncing recent accepted for ${user} (limit ${lim})`);
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
        this.logger.debug(`Processing ${item.titleSlug}`);
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
        const userProblem = await this.userProblemsService.linkProblemToUser(
          problem.id,
        );
        if (userProblem.interval === 0 && userProblem.repetition === 0) {
          userProblem.interval = 1;
        }
        await this.userProblemsService.updateCode(
          userProblem.id,
          submission.code,
        );
        items.push(item.titleSlug);
        this.logger.debug(`Processed ${item.titleSlug}`);
      } catch (e) {
        failures++;
        this.logger.warn(
          `Failed processing ${item.titleSlug}: ${e instanceof Error ? e.message : e}`,
        );
      }
    }

    this.logger.log(
      `Sync complete: created ${created}, updated ${updated}, failures ${failures}`,
    );
    return { created, updated, failures, items };
  }

  async importList(name: string, slugs: string[]) {
    this.logger.log(`Importing list ${name} with ${slugs.length} items`);
    const count = await this.listRepo.count();
    const list = await this.listRepo.save(
      this.listRepo.create({ name, scheduled: count === 0 }),
    );

    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      try {
        const question = await this.getQuestionDetail(slug);
        const problem = await this.problemsService.createOrUpdateFromLcMeta({
          slug,
          title: question.title,
          difficulty: question.difficulty,
          tags: (question.topicTags || []).map((t: any) => t.name),
          description: question.content,
        });
        await this.listItemRepo.save(
          this.listItemRepo.create({ list, problem, order: i }),
        );
        await this.userProblemsService.linkProblemToUser(problem.id);
      } catch (e) {
        this.logger.warn(
          `Failed importing ${slug}: ${e instanceof Error ? e.message : e}`,
        );
      }
    }

    return list;
  }

  private extractProblemListSlug(url: string): string | null {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const i = parts.findIndex((p) => p === 'problem-list');
    return i >= 0 && parts[i + 1] ? parts[i + 1] : null;
  }

  /**
   * Fetch problem slugs from a LeetCode problem list URL. For URLs like
   * https://leetcode.com/problem-list/dynamic-programming/, we treat the slug
   * as a topic tag and query with filters.tags = [slug].
   */
  async slugsFromProblemListUrl(listUrl: string): Promise<string[]> {
    const slug = this.extractProblemListSlug(listUrl);
    if (!slug) throw new Error('Could not parse problem-list slug from URL');

    const limit = 50;
    let skip = 0;
    let total = Infinity;
    const slugs: string[] = [];

    while (skip < total) {
      const variables = {
        categorySlug: '',
        limit,
        skip,
        filters: { tags: [slug] } as any,
      };

      const res = await firstValueFrom<AxiosResponse<LCResponse>>(
        this.http.post<LCResponse>(
          'https://leetcode.com/graphql',
          {
            query: PROBLEMSET_QUERY,
            variables,
            operationName: 'problemsetQuestionList',
          },
          {
            headers: {
              'content-type': 'application/json',
              Referer: 'https://leetcode.com',
            },
          },
        ),
      );

      const body = res.data?.data?.problemsetQuestionList;
      const page = body?.questions ?? [];
      page.forEach((q) => slugs.push(q.titleSlug));
      if (total === Infinity) total = body?.total ?? page.length;
      skip += limit;

      if (skip < total) await new Promise((r) => setTimeout(r, 500));
    }

    return Array.from(new Set(slugs));
  }

  async importLeetcodeList(identifier: string) {
    const url = identifier.startsWith('http')
      ? identifier
      : `https://leetcode.com/problem-list/${identifier}/`;
    const slugs = await this.slugsFromProblemListUrl(url);
    const name = this.extractProblemListSlug(url) ?? identifier;
    return this.importList(name, slugs);
  }

  async getLeetcodeListMeta(identifier: string) {
    const parts = identifier.split('/').filter(Boolean);
    const slug = parts[parts.length - 1];
    if (!slug) {
      throw new Error('Invalid list identifier');
    }
    return this.client.getListMeta(slug);
  }
}
