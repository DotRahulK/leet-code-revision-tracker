import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemsService } from './problems.service';
import { Problem } from './problem.entity';
import { UpsertProblemDto } from './dto/upsert-problem.dto';

jest.mock(
  'class-transformer',
  () => ({
    plainToInstance: jest.fn((_, obj) => obj),
    Transform: () => () => undefined,
    Type: () => () => undefined,
  }),
  { virtual: true },
);

jest.mock(
  'class-validator',
  () =>
    new Proxy(
      {},
      {
        get: () => () => undefined,
      },
    ),
  { virtual: true },
);

describe('ProblemsService', () => {
  let service: ProblemsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Problem],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Problem]),
      ],
      providers: [ProblemsService],
    }).compile();

    service = module.get(ProblemsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('upsert creates when not exists', async () => {
    await service.createOrUpdateFromLcMeta({
      slug: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
    });
    const problem = await service.findBySlug('two-sum');
    expect(problem).toBeTruthy();
    expect(problem?.title).toBe('Two Sum');
    expect(problem?.tags).toEqual(['array', 'hash table']);
  });

  it('upsert updates existing problem', async () => {
    await service.createOrUpdateFromLcMeta({
      slug: 'two-sum',
      title: 'Two Sum Updated',
      difficulty: 'Medium',
      tags: ['Array'],
      description: 'desc',
    });
    const problem = await service.findBySlug('two-sum');
    expect(problem?.title).toBe('Two Sum Updated');
    expect(problem?.difficulty).toBe('Medium');
    expect(problem?.tags).toEqual(['array']);
    expect(problem?.description).toBe('desc');
  });

  it('bulk import counts created and updated', async () => {
    const res = await service.bulkImportFromJson([
      {
        slug: 'two-sum',
        title: 'Two Sum Again',
        difficulty: 'Easy',
        tags: ['Array'],
      },
      {
        slug: 'three-sum',
        title: '3Sum',
        difficulty: 'Medium',
        tags: ['Array'],
      },
    ] as UpsertProblemDto[]);
    expect(res.created).toBe(1);
    expect(res.updated).toBe(1);
    const all = await service.findAll();
    expect(all.total).toBe(2);
  });

  it('normalizes tags (trim, dedupe, lowercase)', async () => {
    await service.createOrUpdateFromLcMeta({
      slug: 'normalize',
      title: 'Normalize',
      difficulty: 'Hard',
      tags: [' Array ', 'array', 'HASH Table', 'hash table '],
    });
    const problem = await service.findBySlug('normalize');
    expect(problem?.tags).toEqual(['array', 'hash table']);
  });
});
