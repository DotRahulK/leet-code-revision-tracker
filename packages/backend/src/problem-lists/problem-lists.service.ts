import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProblemList } from './problem-list.entity';
import { ProblemListItem } from '../problem-list-items/problem-list-item.entity';
import { UserProblemsService } from '../user-problems/user-problems.service';

@Injectable()
export class ProblemListsService {
  constructor(
    @InjectRepository(ProblemList)
    private readonly listRepo: Repository<ProblemList>,
    @InjectRepository(ProblemListItem)
    private readonly itemRepo: Repository<ProblemListItem>,
    private readonly userProblems: UserProblemsService,
  ) {}

  findAll() {
    return this.listRepo.find();
  }

  async schedule(id: string) {
    const list = await this.listRepo.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    await this.listRepo.update({}, { scheduled: false });
    list.scheduled = true;
    await this.listRepo.save(list);

    const items = await this.itemRepo.find({
      where: { list: { id } },
      order: { order: 'ASC' },
      relations: ['problem'],
    });
    const today = new Date();
    let offset = 0;
    for (const item of items) {
      const up = await this.userProblems.linkProblemToUser(item.problem.id);
      if (!up.nextReviewAt) {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        await this.userProblems.schedule(up.id, date);
        offset++;
      }
    }
    return list;
  }
}

