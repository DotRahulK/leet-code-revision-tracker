# Problems Module

Provides CRUD-style APIs for LeetCode problems metadata. Used by sync, scheduling and lists.

## Endpoints

### `GET /problems`
Query params: `search`, `tag`, `difficulty`, `limit` (default 20, max 100), `offset` (default 0)

Returns: `{ items: Problem[], total: number, limit: number, offset: number }`

### `GET /problems/:slug`
Fetch a problem by slug. Returns 404 if not found.

### `PUT /problems/:slug`
Upsert a problem. Body: `UpsertProblemDto`. Slug in URL must match body.

### `POST /problems/import`
Bulk import problems. Body: `BulkImportProblemsDto`. Returns `{ created, updated, errors[] }`.

## DTOs

`UpsertProblemDto`
```ts
{
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags?: string[]; // defaults to []
  description?: string;
}
```

`GetProblemsQueryDto`
```ts
{
  search?: string;
  tag?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  limit?: number; // default 20, max 100
  offset?: number; // default 0
}
```

`BulkImportProblemsDto`
```ts
{
  items: UpsertProblemDto[];
}
```
