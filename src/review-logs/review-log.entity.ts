import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { UserProblem } from '../user-problems/user-problem.entity';

@Entity()
export class ReviewLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProblem)
  userProblem: UserProblem;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewedAt: Date;

  @Column()
  recallRating: number;

  @Column({ nullable: true })
  timeTakenInSeconds: number;

  @Column('text', { nullable: true })
  comments: string;
}
