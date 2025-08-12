import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Problem } from '../problems/problem.entity';
import { ProblemList } from '../problem-lists/problem-list.entity';

export type ScheduledItemType = 'NEXT_UP' | 'REVISION';
export type ScheduledItemStatus = 'PLANNED' | 'DONE' | 'CANCELLED';

@Entity()
export class ScheduledItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: ScheduledItemType;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @ManyToOne(() => Problem, { eager: true })
  problem: Problem;

  @ManyToOne(() => ProblemList, { nullable: true })
  list: ProblemList | null;

  @Column({ type: 'timestamp' })
  dueAt: Date;

  @Column({ type: 'varchar', default: 'PLANNED' })
  status: ScheduledItemStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
