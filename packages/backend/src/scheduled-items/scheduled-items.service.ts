import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ScheduledItem, ScheduledItemType } from './scheduled-item.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import { ScheduleListDto, ScheduleSpacing } from './dto/schedule-list.dto';
import { MarkDoneDto } from './dto/mark-done.dto';
import { CompletionLog } from '../completion-logs/completion-log.entity';

@Injectable()
export class ScheduledItemsService {
  constructor(
    @InjectRepository(ScheduledItem)
    private readonly repo: Repository<ScheduledItem>,
    @InjectRepository(ProblemListItem)
    private readonly listItemRepo: Repository<ProblemListItem>,
    @InjectRepository(CompletionLog)
    private readonly logRepo: Repository<CompletionLog>,
  ) {}

  async scheduleList(listId: string, dto: ScheduleListDto) {
    const items = await this.listItemRepo.find({
      where: { list: { id: listId } },
      relations: ['problem', 'list'],
      order: { order: 'ASC' },
    });
    if (items.length === 0) {
      return [];
    }
    const start = dto.startDate ? new Date(dto.startDate) : new Date();
    const spacing: ScheduleSpacing = dto.spacing || ScheduleSpacing.DAILY;
    const increment = (idx: number) => {
      switch (spacing) {
        case ScheduleSpacing.ALL_TODAY:
          return 0;
        case ScheduleSpacing.ALT_DAYS:
          return idx * 2;
        case ScheduleSpacing.WEEKLY:
          return idx * 7;
        default:
          return idx;
      }
    };
    const scheduled: ScheduledItem[] = [];
    items.forEach((item, idx) => {
      const dueAt = new Date(start);
      const addDays = increment(idx);
      if (addDays) {
        dueAt.setDate(dueAt.getDate() + addDays);
      }
      const entity = this.repo.create({
        type: 'NEXT_UP',
        problem: item.problem,
        list: item.list,
        dueAt,
        status: 'PLANNED',
      });
      scheduled.push(entity);
    });
    return this.repo.save(scheduled);
  }

  async unscheduleList(listId: string) {
    await this.repo.update(
      { list: { id: listId }, status: 'PLANNED' },
      { status: 'CANCELLED' },
    );
    return { success: true };
  }

  findAll(type?: ScheduledItemType | 'ALL') {
    const where: FindOptionsWhere<ScheduledItem> | undefined =
      type && type !== 'ALL' ? { type } : undefined;
    return this.repo.find({ where, order: { dueAt: 'ASC' } });
  }

  async markDone(id: string, dto: MarkDoneDto) {
    const item = await this.repo.findOne({ where: { id }, relations: ['problem', 'user'] });
    if (!item) {
      throw new NotFoundException('Scheduled item not found');
    }
    item.status = 'DONE';
    await this.repo.save(item);
    const log = this.logRepo.create({
      user: item.user,
      problem: item.problem,
      ratedQuality: dto.ratedQuality ?? null,
      notes: dto.notes ?? null,
      solutionCode: dto.solutionCode ?? null,
      timeTakenMinutes: dto.timeTakenMinutes ?? null,
      referencesUsed: dto.referencesUsed ?? false,
      source: item.type,
    });
    await this.logRepo.save(log);
    return item;
  }
}
