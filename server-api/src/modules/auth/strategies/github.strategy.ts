import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { configuration } from '../../../configs/configuration';
import { ThirdPartyUserDto } from '../dtos/third-party-user.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: configuration().github.clientId,
      clientSecret: configuration().github.clientSecret,
      callbackURL: configuration().github.callBackUrl,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: Function,
  ): Promise<any> {
    const user = {
      username: profile.username,
      image: profile.photos[0].value,
    };
    cb(null, profile);
  }
}
