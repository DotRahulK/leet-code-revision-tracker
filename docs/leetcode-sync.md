# LeetCode Sync

This module syncs accepted submissions from LeetCode into the local database.

## Getting cookies

1. Log in to [leetcode.com](https://leetcode.com) in your browser.
2. Open the developer tools and inspect the request headers for any GraphQL call.
3. Copy the values of `LEETCODE_SESSION` and `csrftoken`.
4. Add them to your `.env` file as `LC_SESSION` and `LC_CSRF_TOKEN` along with `LC_USERNAME`.

## Running sync

Send a POST request to `/leetcode/sync` with optional body:

```json
{
  "username": "your_username",
  "limit": 20
}
```

If omitted, the values from environment variables are used.

## Data mapping

- Problem metadata (title, slug, difficulty, tags, description) is stored in `Problem`.
- Accepted submission source is stored in `UserProblem.lastSubmittedCode`.
- New `UserProblem` rows start with SM-2 defaults: easinessFactor `2.5`, repetition `0`, interval `1`.

Running sync multiple times is idempotent.

## API documentation

Swagger UI is available at `/api` when the server is running. It includes the
LeetCode sync endpoints described above.
