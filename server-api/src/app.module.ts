import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FeedbackModule } from './modules/feedbacks/feedbacks.module';
import { CommentModule } from './modules/comments/comments.module';
import { configuration } from './configs/configuration';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(
        __dirname,
        '../env',
        `${process.env.NODE_ENV ? process.env.NODE_ENV : 'production'}.env`,
      ),
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: configuration().database.type,
      host: configuration().database.host,
      port: Number(configuration().database.port),
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    FeedbackModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
