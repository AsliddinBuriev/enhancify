import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  password: string;
}
