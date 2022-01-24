import { Exclude } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class FindOneUserDto {
  @IsNumber()
  id?: number;

  @IsEmail()
  email?: string;

  @Exclude()
  @IsString()
  password?: string;

  @Exclude()
  @IsString()
  resetPasswordToken?: string;

  @Exclude()
  @IsDate()
  resetPasswordExpiresAt?: string;
}
