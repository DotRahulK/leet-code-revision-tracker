import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledItem } from './scheduled-item.entity';
import { ScheduledItemsService } from './scheduled-items.service';
import { ScheduledItemsController } from './scheduled-items.controller';
import { CustomListSchedulingController } from './custom-list-scheduling.controller';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import { CompletionLog } from '../completion-logs/completion-log.entity';
import { Problem } from '../problems/problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduledItem, ProblemListItem, CompletionLog, Problem]),
  ],
  controllers: [ScheduledItemsController, CustomListSchedulingController],
  providers: [ScheduledItemsService],
  exports: [ScheduledItemsService],
})
export class ScheduledItemsModule {}
