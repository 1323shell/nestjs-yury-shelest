import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  @MinLength(12)
  @MaxLength(20)
  oldPassword: string;
}
