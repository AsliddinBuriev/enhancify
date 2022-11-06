import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAtStrategy } from './strategies/jwt-at.strategy';
import { JwtRtStrategy } from './strategies/jwt-rt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAtStrategy,
    JwtRtStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
  imports: [UsersModule, PassportModule, JwtModule.register({})],
})
export class AuthModule {}
