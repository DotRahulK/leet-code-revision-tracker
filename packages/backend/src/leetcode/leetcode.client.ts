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
    let total = Infinity;

    while (skip < total) {
      const res = await this.post<{ data: { problemsetQuestionList: { total: number; questions: any[] } } }>(
        this.problemsetQuestionListQuery,
        { listId, skip, limit },
      );
      const data = res.data.problemsetQuestionList;
      total = data.total;
      slugs.push(...data.questions.map((q: any) => q.titleSlug));
      skip += limit;
    }

    return { name: listId, slugs };
  }
}
