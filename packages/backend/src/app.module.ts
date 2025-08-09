import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProblemsModule } from './user-problems/user-problems.module';
import { ProblemsModule } from './problems/problems.module';
import { LeetcodeModule } from './leetcode/leetcode.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME || 'leetcode',
      password: process.env.DB_PASSWORD || 'leetcode',
      database: process.env.DB_NAME || 'leetcode',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UserProblemsModule,
    ProblemsModule,
    LeetcodeModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
