# LeetCode Sync Module

This module syncs accepted submissions and problem metadata from LeetCode into the local database.

## Obtaining Cookies
1. Log in to [LeetCode](https://leetcode.com) in your browser.
2. Inspect cookies and copy values for `LEETCODE_SESSION` and `csrftoken`.
3. Set the following environment variables in `.env`:

```
LC_USERNAME=<your username>
LC_CSRF_TOKEN=<csrftoken>
LC_SESSION=<LEETCODE_SESSION>
```

## Triggering Sync
Use the development endpoint:

```
POST /leetcode/sync
{
  "username": "<optional username>",
  "limit": 20
}
```

The endpoint pulls recent accepted submissions, upserts problems, and stores the latest solution code in `UserProblem`.

## Data Mapping
- `difficulty` is stored as `Easy`, `Medium`, or `Hard`.
- Tags are normalized to lowercase.
- `lastSolutionCode` is updated only for accepted submissions.
- New `UserProblem` rows start with `interval = 1`, `repetition = 0`, `easinessFactor = 2.5`.
