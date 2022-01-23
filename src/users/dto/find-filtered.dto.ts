import { Prisma } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindUsersDto {
  // just not to force the user to enter a valid email
  @IsString()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
