import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  password: string;
}
