import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Problem } from '../../problems/problem.entity';

@Entity()
export class UserProblem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Problem, { eager: true })
  problem: Problem;

  @Column({ type: 'date', nullable: true })
  nextReviewAt: Date | null;

  @Column({ type: 'float', default: 2.5 })
  easinessFactor: number;

  @Column({ type: 'int', default: 0 })
  interval: number;

  @Column({ type: 'int', default: 0 })
  repetition: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  lastSolutionCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
