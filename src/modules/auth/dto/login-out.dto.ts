import { IsEmail, IsString } from 'class-validator';

export class LogInOutDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
