import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { createHash } from 'crypto';
import { JwtPayload } from '../types/jwt-payload.type';
import { configuration } from '../../../configs/configuration';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/users.entity';

//todo move business logic to auth service
@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey: configuration().jwt.rtSecret,
    });
  }
  async validate(req: Request, payload: JwtPayload): Promise<User> {
    try {
      const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
      if (!refreshToken)
        throw new UnauthorizedException(
          'Refresh token malformed. Please, login again.',
        );
      const user = await this.usersService.findOne({ id: payload.sub });
      if (!user) throw new UnauthorizedException('User no longer exists.');
      const hashedRefreshToken = createHash('sha256')
        .update(refreshToken)
        .digest('hex');
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt !== hashedRefreshToken,
      );
      await this.usersService.updateToken(user.id, user.refreshTokens);
      const decodedToken = this.jwtService.decode(refreshToken, { json: true });
      if (decodedToken['exp'] < Date.now() / 1000)
        throw new UnauthorizedException(
          'Refresh token expired. Please, login again.',
        );
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
