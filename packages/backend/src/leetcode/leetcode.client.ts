import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LEETCODE_CONFIG, type LeetcodeConfig } from './leetcode.config';

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

  async getProblemList(slug: string): Promise<{ name: string; slugs: string[] }> {
    const res = await fetch(`https://leetcode.com/list/api/questions/${slug}/?page=1`, {
      headers: {
        Cookie: `LEETCODE_SESSION=${this.config.session}; csrftoken=${this.config.csrfToken}`,
        'x-csrftoken': this.config.csrfToken,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch list ${slug}`);
    }
    const data: any = await res.json();
    const questions = data.questions || data.stat_status_pairs || [];
    const slugs = questions.map((q: any) => q.slug || q.stat?.question__title_slug).filter(Boolean);
    const name = data.name || slug;
    return { name, slugs };
  }
}
