# Frontend

Angular application with Angular Material.

## Development

```
npm run setup
npm start
```

`npm run api:gen` generates the OpenAPI client from `http://localhost:3000/api-json` into `src/app/api`.

Facade services wrapping API calls live under `src/app/core`.

Routes are defined in `src/app/app.routes.ts`.

### Pages

- `/` dashboard
- `/reviews` spaced-repetition reviews
- `/problems` problem browser
- `/lists` saved lists
- `/lists/custom` manage custom lists and schedule them for upcoming practice
- `/scheduled` view items planned for Next-Up or due for revision
- `/sync` trigger LeetCode sync

### Theme Toggle

Use the slide toggle in the application toolbar to switch between light and high-contrast dark themes. The choice persists across reloads.
