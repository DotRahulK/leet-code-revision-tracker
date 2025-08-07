import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Problem } from './problems/problem.entity';
import { UserProblem } from './user-problems/entities/user-problem.entity';
import { ProblemList } from './problem-lists/problem-list.entity';
import { ProblemListItem } from './problem-list-items/problem-list-item.entity';
import { ReviewLog } from './review-logs/review-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME || 'leetcode',
  password: process.env.DB_PASSWORD || 'leetcode',
  database: process.env.DB_NAME || 'leetcode',
  entities: [
    User,
    Problem,
    UserProblem,
    ProblemList,
    ProblemListItem,
    ReviewLog,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
