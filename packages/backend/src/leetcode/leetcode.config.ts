export interface LeetcodeConfig {
  username: string;
  csrfToken: string;
  session: string;
  baseUrl: string;
  pageSize: number;
}

export const LEETCODE_CONFIG = 'LEETCODE_CONFIG';

export const loadLeetcodeConfig = (): LeetcodeConfig => ({
  username: process.env.LC_USERNAME ?? '',
  csrfToken: process.env.LC_CSRF_TOKEN ?? '',
  session: process.env.LC_SESSION ?? '',
  baseUrl: process.env.LC_BASE_URL ?? 'https://leetcode.com/graphql',
  pageSize: parseInt(process.env.LC_PAGE_SIZE ?? '20', 10),
});
