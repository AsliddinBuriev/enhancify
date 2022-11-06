import { Module } from '@nestjs/common';
import { FeedbackController } from './feedbacks.controller';
import { FeedbackService } from './feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './feedbacks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
