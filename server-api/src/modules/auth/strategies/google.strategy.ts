import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { configuration } from '../../../configs/configuration';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configuration().google.clientId,
      clientSecret: configuration().google.clientSecret,
      callbackURL: configuration().google.callBackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    cb: VerifyCallback,
  ): Promise<any> {
    const { name, photos } = profile;
    const username = name.givenName.split('@')[0];
    const user = {
      username,
      image: photos[0].value,
    };
    cb(null, user);
  }
}
