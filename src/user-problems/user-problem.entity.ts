import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Problem } from '../problems/problem.entity';
import { User } from '../users/user.entity';

@Entity()
export class UserProblem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Problem, { eager: true })
  problem: Problem;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ default: 2.5 })
  easinessFactor: number;

  @Column({ default: 0 })
  repetition: number;

  @Column({ default: 1 })
  interval: number;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextReviewAt: Date;

  @Column({ nullable: true })
  lastRecallRating: number;

  @Column('text', { nullable: true })
  lastSubmittedCode: string;

  @Column('text', { nullable: true })
  notes: string;
}
