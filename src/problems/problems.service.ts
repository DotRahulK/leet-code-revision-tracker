import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './problem.entity';

export interface LcProblemMeta {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
}

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly repo: Repository<Problem>,
  ) {}

  async createOrUpdateFromLcMeta(
    meta: LcProblemMeta,
  ): Promise<{ problem: Problem; created: boolean }> {
    let problem = await this.repo.findOne({ where: { slug: meta.slug } });
    const created = !problem;
    if (problem) {
      problem.title = meta.title;
      problem.difficulty = meta.difficulty;
      problem.tags = meta.tags;
      problem.description = meta.description;
    } else {
      problem = this.repo.create(meta);
    }
    problem = await this.repo.save(problem);
    return { problem, created };
  }
}
