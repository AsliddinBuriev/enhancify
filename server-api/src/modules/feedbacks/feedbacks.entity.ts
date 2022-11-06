import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';
@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  category: string;
  @Column()
  status: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.feedbacks, { onDelete: 'CASCADE' })
  user: User;
  @OneToMany(() => Comment, (commnet) => commnet.feedback)
  comments: Comment[];
}
