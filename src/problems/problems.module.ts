import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  providers: [ProblemsService],
  controllers: [ProblemsController],
  exports: [ProblemsService, TypeOrmModule],
})
export class ProblemsModule {}
