import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type';
import { configuration } from '../../../configs/configuration';
import { UsersService } from '../../users/users.service';
@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.atSecret,
    });
  }
  async validate(payload: JwtPayload, done: Function) {
    const user = await this.usersService.findOne({ id: payload.sub });
    if (!user) throw new UnauthorizedException('User no longer exists.');
    return user;
  }
}
