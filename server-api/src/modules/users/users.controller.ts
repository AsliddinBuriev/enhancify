import {
  Controller,
  Post,
  Body,
  Delete,
  HttpCode,
  UseGuards,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @UseGuards(AuthGuard('jwt-at'))
  @Get('/')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-at'))
  async getUsers() {
    return await this.userService.findMany();
  }
  @Get('me')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-at'))
  async getMe(@Param('id') id: number) {
    return await this.userService.findOne({ id });
  }
  @Patch('me')
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt-at'))
  async updateMe(@Param('id') id: number, @Body() body: UpdateUserDto) {}
  @Delete('me')
  @HttpCode(200)
  async deleteMe(@Param('id') id: number) {
    return await this.userService.deleteOne(id);
  }
}
