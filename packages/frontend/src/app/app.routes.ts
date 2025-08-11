import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/dashboard.page';
import { ReviewsPage } from './features/reviews/reviews.page';
import { ProblemsPage } from './features/problems/problems.page';
import { ProblemDetailPage } from './features/problem-detail/problem-detail.page';
import { ListsPage } from './features/lists/lists.page';
import { ListDetailPage } from './features/list-detail/list-detail.page';
import { SyncPage } from './features/sync/sync.page';

export const appRoutes: Routes = [
  { path: '', component: DashboardPage },
  { path: 'reviews', component: ReviewsPage },
  { path: 'problems', component: ProblemsPage },
  { path: 'problems/:slug', component: ProblemDetailPage },
  { path: 'lists', component: ListsPage },
  { path: 'lists/:id', component: ListDetailPage },
  { path: 'sync', component: SyncPage },
  { path: '**', redirectTo: '' }
];
