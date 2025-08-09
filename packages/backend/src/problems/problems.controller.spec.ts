import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Problem } from './problem.entity';
import { ProblemsModule } from './problems.module';
import { ProblemsService } from './problems.service';

describe('ProblemsController', () => {
  let app: INestApplication;
  let service: ProblemsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Problem],
          synchronize: true,
        }),
        ProblemsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
    service = moduleRef.get(ProblemsService);

    await service.createOrUpdateFromLcMeta({
      slug: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
    });
    await service.createOrUpdateFromLcMeta({
      slug: 'three-sum',
      title: '3Sum',
      difficulty: 'Medium',
      tags: ['Array', 'Two Pointers'],
    });
    await service.createOrUpdateFromLcMeta({
      slug: 'binary-search',
      title: 'Binary Search',
      difficulty: 'Easy',
      tags: ['Binary Search'],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /problems returns paginated list', async () => {
    const res = await request(app.getHttpServer()).get(
      '/problems?limit=2&offset=0',
    );
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.total).toBe(3);
    expect(res.body.limit).toBe(2);
    expect(res.body.offset).toBe(0);
  });

  it('filters by difficulty, tag and search', async () => {
    const res = await request(app.getHttpServer()).get(
      '/problems?difficulty=Medium&tag=array&search=sum',
    );
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].slug).toBe('three-sum');
  });

  it('GET /problems/:slug returns 404 when missing', async () => {
    const res = await request(app.getHttpServer()).get(
      '/problems/not-found',
    );
    expect(res.status).toBe(404);
  });

  it('POST /problems/import returns created/updated counts', async () => {
    const payload = {
      items: [
        {
          slug: 'two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
          tags: ['Array'],
        },
        {
          slug: 'four-sum',
          title: '4Sum',
          difficulty: 'Hard',
          tags: ['Array'],
        },
      ],
    };
    const res = await request(app.getHttpServer())
      .post('/problems/import')
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body.created).toBe(1);
    expect(res.body.updated).toBe(1);
  });
});
