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
