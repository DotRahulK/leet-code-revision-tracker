import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Problem } from '../problems/problem.entity';
import { ScheduledItemType } from '../scheduled-items/scheduled-item.entity';

@Entity()
export class CompletionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @ManyToOne(() => Problem)
  problem: Problem;

  @Column({ type: 'int', nullable: true })
  ratedQuality: number | null;

  @Column('text', { nullable: true })
  notes: string | null;

  @Column('text', { nullable: true })
  solutionCode: string | null;

  @Column({ type: 'int', nullable: true })
  timeTakenMinutes: number | null;

  @Column({ default: false })
  referencesUsed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  doneAt: Date;

  @Column({ type: 'varchar' })
  source: ScheduledItemType | 'ADHOC';
}
