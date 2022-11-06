import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Feedback } from '../feedbacks/feedbacks.entity';
import { User } from '../users/users.entity';
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  content: string;
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL' })
  user: User;
  @ManyToOne(() => Feedback, (feedback) => feedback.comments, {
    onDelete: 'CASCADE',
  })
  feedback: Feedback;
}
