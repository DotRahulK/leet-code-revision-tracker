import { Injectable } from '@nestjs/common';

export interface GraphqlResponse<T> {
  data: T;
  errors?: any;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class LeetcodeClient {
  private readonly baseUrl =
    process.env.LC_BASE_URL || 'https://leetcode.com/graphql';
  private readonly csrf = process.env.LC_CSRF_TOKEN || '';
  private readonly session = process.env.LC_SESSION || '';

  async post<T>(
    query: string,
    variables: Record<string, any>,
  ): Promise<GraphqlResponse<T>> {
    const body = JSON.stringify({ query, variables });
    const headers = {
      'Content-Type': 'application/json',
      'x-csrftoken': this.csrf,
      Cookie: `LEETCODE_SESSION=${this.session}; csrftoken=${this.csrf}`,
    } as Record<string, string>;

    let attempt = 0;
    while (true) {
      try {
        const res = await fetch(this.baseUrl, {
          method: 'POST',
          headers,
          body,
        });
        if (res.status === 401 || res.status === 403) {
          throw new Error('Invalid or expired session cookies');
        }
        const json = (await res.json()) as GraphqlResponse<T>;
        return json;
      } catch (err) {
        attempt++;
        if (attempt >= 3) throw err;
        await delay(100 * attempt);
      }
    }
  }
}
