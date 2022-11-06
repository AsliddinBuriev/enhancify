import {
  Controller,
  HttpCode,
  Body,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrenctUser } from './decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { SignUpUserDto } from './dtos/signup.dto';
import { SignInUserDto } from './dtos/signin.dto';
import { ThirdPartyUser } from './decorators/third-party-user.decorator';
import { ThirdPartyUserDto } from './dtos/third-party-user.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('local/signup')
  @HttpCode(201)
  async localSignup(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.localSignUp(signUpUserDto);
  }
  @Post('local/signin')
  @HttpCode(200)
  async localSignin(@Body() signInUserDto: SignInUserDto) {
    return this.authService.localSignIn(
      signInUserDto.username,
      signInUserDto.password,
    );
  }
  @UseGuards(AuthGuard('jwt-at'))
  @Get('me')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  me(@CurrenctUser() user: User) {
    return user;
  }
  @UseGuards(AuthGuard('jwt-at'))
  @Post('signout')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  async logout(@Body() body, @CurrenctUser() user: User) {
    return this.authService.signOut(body.refreshToken, user);
  }
  @UseGuards(AuthGuard('jwt-rt'))
  @Post('refresh-token')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  async refreshToken(@CurrenctUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/signin')
  @HttpCode(200)
  async googleAuth(@Req() req: any) {}

  @UseGuards(AuthGuard('google'))
  @HttpCode(200)
  @Get('google/callback')
  async googleAuthRedirect(
    @ThirdPartyUser() thirdPartyUser: ThirdPartyUserDto,
    @Res() res: Response,
  ) {
    console.log('thirdPartyUser', thirdPartyUser);
    const tokens = await this.authService.thirdPartySignIn(thirdPartyUser);
    console.log('tokens', tokens);
    res.json({
      message: 'hello from google callback',
      tokens,
    });
  }
  @UseGuards(AuthGuard('github'))
  @HttpCode(200)
  @Get('github/signin')
  async githubAuth(@Req() req: any) {}

  @UseGuards(AuthGuard('github'))
  @HttpCode(200)
  @Get('github/callback')
  async githubAuthRedirect(
    @ThirdPartyUser() thirdPartyUser: ThirdPartyUserDto,
    @Res() res: Response,
  ) {
    console.log('thirdPartyUser', thirdPartyUser);
    const tokens = await this.authService.thirdPartySignIn(thirdPartyUser);
    res.json({
      message: 'hello from github callback',
      tokens,
    });
  }
}
