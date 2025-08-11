# API Endpoints

| Method | Path | Request | Response | Used In |
| ------ | ---- | ------- | -------- | ------- |
| GET | `/api/problems` | `search?`, `tag?`, `difficulty?`, `limit?`, `offset?` | `{ items: Problem[], total, limit, offset }` | ProblemsPage |
| GET | `/api/problems/:slug` | – | `Problem` | ProblemDetailPage |
| GET | `/api/reviews/today` | `userId?` | `UserProblem[]` | ReviewsPage, DashboardPage |
| POST | `/api/reviews/:id` | `{ quality: number }` | – | ReviewsPage |
| PATCH | `/api/user-problems/:id/notes` | `{ notes: string }` | – | ProblemDetailPage |
| PATCH | `/api/user-problems/:id/code` | `{ code: string }` | – | ProblemDetailPage |
| GET | `/api/lists` | – | `ProblemList[]` | ListsPage, DashboardPage |
| GET | `/api/lists/:id` | – | `ProblemList` | ListDetailPage |
| POST | `/api/leetcode/list` | `{ list: string }` | `ProblemList` | ListsPage (import) |
| POST | `/api/leetcode/sync` | `{ username?, limit? }` (optional) | `{ created, updated, failures }` | SyncPage |

