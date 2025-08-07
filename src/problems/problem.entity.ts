import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  difficulty: 'Easy' | 'Medium' | 'Hard';

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
