# Frontend Architecture

The Angular application is built with standalone components and Angular Material.

## Routes

- `/` → `DashboardPage`
- `/reviews` → `ReviewsPage`
- `/problems` → `ProblemsPage`
- `/problems/:slug` → `ProblemDetailPage`
- `/lists` → `ListsPage`
- `/lists/:id` → `ListDetailPage`
- `/sync` → `SyncPage`

## Structure

- `core/` contains the `ApiFacadeService` which wraps generated OpenAPI services.
- `core/state/` holds lightweight stores implemented with Angular signals.
- `shared/ui/` provides reusable UI components built with Angular Material.
- Feature pages live under `features/` and are implemented as standalone components.

The OpenAPI client is generated with `ng-openapi-gen` into `src/app/api` during `npm start` and `npm build`.
