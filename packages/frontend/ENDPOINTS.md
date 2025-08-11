# API Endpoints

| Method | Path | Request | Response | Used In |
| ------ | ---- | ------- | -------- | ------- |
| GET | `/problems` | `search?`, `tag?`, `difficulty?`, `limit?`, `offset?` | `Problem[]` | ProblemsPage |
| GET | `/problems/:slug` | – | `Problem` | ProblemDetailPage |
| GET | `/reviews/today` | `userId?` | `UserProblem[]` | ReviewsPage, DashboardPage |
| POST | `/reviews/:id` | `{ quality: number }` | – | ReviewsPage |
| PATCH | `/user-problems/:id/notes` | `{ notes: string }` | – | ProblemDetailPage |
| PATCH | `/user-problems/:id/code` | `{ code: string }` | – | ProblemDetailPage |
| GET | `/lists` | – | `ProblemList[]` | ListsPage, DashboardPage |
| GET | `/lists/:id` | – | `ProblemList` | ListDetailPage |
| POST | `/leetcode/list` | `{ list: string }` | `ProblemList` | ListsPage (import) |
| POST | `/leetcode/sync` | `{ username?, limit? }` | `{ created, updated, failures }` | SyncPage |
