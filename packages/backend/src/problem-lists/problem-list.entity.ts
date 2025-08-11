import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ProblemList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'custom' })
  source: 'custom' | 'blind75' | 'neetcode' | 'grind75';

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ default: false })
  scheduled: boolean;
}
