import { Inject, Injectable, Logger } from '@nestjs/common';
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

  async importLeetcodeList(identifier: string) {
    const parts = identifier.split('/').filter(Boolean);
    const slug = parts[parts.length - 1];
    if (!slug) {
      throw new Error('Invalid list identifier');
    }
    const { name, slugs } = await this.client.getProblemList(slug);
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
