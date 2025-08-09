import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from './problem.entity';
import { GetProblemsQueryDto } from './dto/get-problems-query.dto';
import { UpsertProblemDto } from './dto/upsert-problem.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ProblemsService {
  private readonly logger = new Logger(ProblemsService.name);
  constructor(
    @InjectRepository(Problem)
    private readonly repo: Repository<Problem>,
  ) {}

  async findAll(query: GetProblemsQueryDto = {} as any) {
    this.logger.debug(`Finding problems with query ${JSON.stringify(query)}`);
    const qb = this.repo.createQueryBuilder('problem');

    if (query.search) {
      qb.andWhere(
        '(LOWER(problem.title) LIKE :search OR LOWER(problem.slug) LIKE :search)',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }
    if (query.difficulty) {
      qb.andWhere('problem.difficulty = :difficulty', {
        difficulty: query.difficulty,
      });
    }
    if (query.tag) {
      qb.andWhere('LOWER(problem.tags) LIKE :tag', {
        tag: `%${query.tag.toLowerCase()}%`,
      });
    }

    const limit = Math.min(query.limit ?? 20, 100);
    const offset = query.offset ?? 0;
    qb.take(limit).skip(offset);

    const [items, total] = await qb.getManyAndCount();
    this.logger.debug(`Found ${total} problems`);
    return { items, total, limit, offset };
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    this.logger.debug(`Looking up problem by slug ${slug}`);
    return this.repo.findOne({ where: { slug } });
  }

  private normalizeTags(tags: string[] = []): string[] {
    const normalized = tags
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);
    return Array.from(new Set(normalized));
  }

  async createOrUpdateFromLcMeta(
    meta: UpsertProblemDto,
    repository: Repository<Problem> = this.repo,
  ): Promise<Problem> {
    this.logger.debug(`Upserting problem ${meta.slug}`);
    const normalizedTags = this.normalizeTags(meta.tags || []);
    let problem = await repository.findOne({ where: { slug: meta.slug } });
    if (!problem) {
      problem = repository.create({ slug: meta.slug });
    }
    problem.title = meta.title;
    problem.difficulty = meta.difficulty;
    problem.tags = normalizedTags;
    problem.description = meta.description ?? null;
    const saved = await repository.save(problem);
    this.logger.debug(`Saved problem ${meta.slug}`);
    return saved;
  }

  async bulkImportFromJson(items: UpsertProblemDto[]) {
    let created = 0;
    let updated = 0;
    const errors: { index: number; reason: string }[] = [];

    await this.repo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Problem);
      for (let i = 0; i < items.length; i++) {
        const dto = plainToInstance(UpsertProblemDto, items[i]);
        const validationErrors = validateSync(dto);
        if (validationErrors.length) {
          const reason = Object.values(
            validationErrors[0].constraints ?? {},
          ).join(', ');
          errors.push({ index: i, reason });
          this.logger.warn(`Skipping item ${i}: ${reason}`);
          continue;
        }
        const exists = await repo.findOne({ where: { slug: dto.slug } });
        await this.createOrUpdateFromLcMeta(dto, repo);
        if (exists) {
          updated++;
        } else {
          created++;
        }
      }
    });

    this.logger.debug(
      `Bulk import complete: created ${created}, updated ${updated}, errors ${errors.length}`,
    );
    return { created, updated, errors };
  }
}
