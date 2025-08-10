import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ProblemList } from '../problem-lists/problem-list.entity';
import { Problem } from '../problems/problem.entity';

@Entity()
export class ProblemListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProblemList, { onDelete: 'CASCADE' })
  list: ProblemList;

  @ManyToOne(() => Problem, { eager: true })
  problem: Problem;

  @Column({ default: 0 })
  order: number;
}
