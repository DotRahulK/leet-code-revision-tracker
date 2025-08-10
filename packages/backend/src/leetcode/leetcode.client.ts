import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LEETCODE_CONFIG, type LeetcodeConfig } from './leetcode.config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LeetcodeClient {
  constructor(
    @Inject(LEETCODE_CONFIG) private readonly config: LeetcodeConfig,
  ) {}

  private async request(body: any, retries = 3): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          Cookie: `LEETCODE_SESSION=${this.config.session}; csrftoken=${this.config.csrfToken}`,
          'x-csrftoken': this.config.csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (res.status === 401 || res.status === 403) {
        throw new UnauthorizedException('Invalid/expired session cookies');
      }
      if (!res.ok && res.status >= 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 100));
        continue;
      }
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      return res.json();
    }
  }

  post<T>(query: string, variables: Record<string, any>): Promise<T> {
    return this.request({ query, variables });
  }

  private readonly problemsetQuestionListQuery = fs.readFileSync(
    path.join(__dirname, 'graphql/problemsetQuestionList.graphql'),
    'utf8',
  );

  async getProblemList(listId: string): Promise<{ name: string; slugs: string[] }> {
    const limit = 50;
    let skip = 0;
    const slugs: string[] = [];

    while (true) {
      const res = await this.post<{ data: { problemsetQuestionList: { questions: any[] } } }>(
        this.problemsetQuestionListQuery,
        { listId, skip, limit },
      );
      const data = res.data.problemsetQuestionList;
      const questions = data?.questions ?? [];
      if (questions.length === 0) break;
      slugs.push(...questions.map((q: any) => q.titleSlug));
      if (questions.length < limit) break;
      skip += limit;
    }

    return { name: listId, slugs };
  }

  async getListMeta(listId: string): Promise<{ name: string; total: number }> {
    const res = await fetch(`https://leetcode.com/api/list/${listId}/`, {
      headers: {
        Cookie: `LEETCODE_SESSION=${this.config.session}; csrftoken=${this.config.csrfToken}`,
        'x-csrftoken': this.config.csrfToken,
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    const total = Array.isArray(data.questions)
      ? data.questions.length
      : data.num_questions ?? 0;

    return { name: data.name ?? listId, total };
  }
}
