import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignUpUserDto } from './dtos/signup.dto';
import { configuration } from '../../configs/configuration';
import { TokenType } from './types/tokens.type';
import { ThirdPartyUserDto } from './dtos/third-party-user.dto';
import { User } from '../users/users.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async localSignUp(
    signUpUserDto: SignUpUserDto,
  ): Promise<{ tokens: TokenType }> {
    let user = await this.usersService.findOne({
      username: signUpUserDto.username,
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hash = await bcrypt.hash(signUpUserDto.password, 10);
    const newUser = await this.usersService.createOne({
      username: signUpUserDto.username,
      hash,
    });
    const tokens = await this.signTokens(newUser.id, newUser.username);
    return {
      tokens,
    };
  }
  async localSignIn(
    username: string,
    passport: string,
  ): Promise<{ tokens: TokenType }> {
    const user = await this.usersService.findOne({
      username,
    });
    if (!user || !(await bcrypt.compare(passport, user.hash))) {
      throw new BadRequestException('Wrong username or password');
    }
    const tokens = await this.signTokens(user.id, user.username);
    return {
      tokens,
    };
  }
  async signOut(refreshToken: string, user: User): Promise<any> {
    const hashedRefreshToken = createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt !== hashedRefreshToken,
    );
    await this.usersService.updateToken(user.id, user.refreshTokens);
    return {
      message: 'Logout success',
    };
  }

  async refreshToken(user: User): Promise<{ tokens: TokenType }> {
    const tokens = await this.signTokens(user.id, user.username);
    return { tokens };
  }
  async thirdPartySignIn(
    thirdPartyUser: ThirdPartyUserDto,
  ): Promise<{ tokens: TokenType }> {
    let user = await this.usersService.findOne({
      username: thirdPartyUser.username,
    });
    if (!user) {
      user = await this.usersService.createOne(thirdPartyUser);
    } else {
      await this.usersService.updateOne(user.id, thirdPartyUser);
    }
    const tokens = await this.signTokens(user.id, thirdPartyUser.username);
    return {
      tokens,
    };
  }

  async signTokens(id: number, username: string): Promise<TokenType> {
    const accessToken = await this.jwtService.signAsync(
      { sub: id, username },
      {
        expiresIn: configuration().jwt.atExpiresIn,
        secret: configuration().jwt.atSecret,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: id,
        username,
      },
      {
        expiresIn: configuration().jwt.rtExpiresIn,
        secret: configuration().jwt.rtSecret,
      },
    );
    const hashedRefreshToken = createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const user = await this.usersService.findOne({ id });
    user.refreshTokens = user?.refreshTokens
      ? [...user.refreshTokens, hashedRefreshToken]
      : [hashedRefreshToken];
    await this.usersService.updateToken(user.id, user.refreshTokens);
    return { accessToken, refreshToken };
  }
}
