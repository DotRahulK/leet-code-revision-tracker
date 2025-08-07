# User Problems Module

Manages spaced repetition metadata and user-specific notes for coding problems.

## Endpoints

### `GET /reviews/today`
Returns all user problems due for review today. Optional `userId` query parameter filters by user.

### `POST /reviews/:id`
Body: `{ "quality": 0-5 }`
Rates recall for a user problem and updates scheduling fields according to the SM-2 algorithm.

### `PATCH /user-problems/:id/notes`
Body: `{ "notes": string }`
Updates notes for the given user problem.

### `PATCH /user-problems/:id/code`
Body: `{ "code": string }`
Updates last solution code snippet for the given user problem.

## Scheduling
Scheduling is based on the SM-2 algorithm. Easiness factor is bounded below by `1.3` and repetition resets when recall quality is below `3`.
