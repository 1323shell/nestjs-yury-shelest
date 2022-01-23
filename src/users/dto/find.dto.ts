import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class FindOneUserDto {
  @IsNumber()
  id?: number;

  @IsEmail()
  email?: string;

  @Exclude()
  password?: string;
}
