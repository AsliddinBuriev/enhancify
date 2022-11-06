import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Feedback } from '../feedbacks/feedbacks.entity';
import { Comment } from '../comments/comments.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({
    unique: true,
  })
  username: string;
  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  hash?: string;
  @Column('text', { nullable: true })
  image?: string;
  @Column('text', { array: true, nullable: true })
  refreshTokens?: string[];
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks?: Feedback[];
  @OneToMany(() => Comment, (commnet) => commnet.user)
  comments?: Comment[];
}
