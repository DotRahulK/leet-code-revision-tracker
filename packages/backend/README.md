# Backend

NestJS + TypeORM backend. All routes are prefixed with `/api`.

## Environment

- `DB_HOST`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT`

## Migrations

```
npm run migration:run -w @lcrt/backend
```

## Swagger

- UI: `http://localhost:3000/api`
- JSON: `http://localhost:3000/api-json`

CORS is enabled by default.

## Lists & Scheduling

The API exposes a lightweight planning system for "Next-Up" problems.

- `POST /lists/custom/:id/schedule` – create `PLANNED` scheduled items for a custom list.
- `DELETE /lists/custom/:id/schedule` – cancel any `PLANNED` items for that list.
- `GET /scheduled?type=NEXT_UP|REVISION|ALL` – view scheduled items.
- `POST /scheduled/:id/done` – mark an item done and log completion details.
