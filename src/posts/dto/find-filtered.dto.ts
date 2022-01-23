import { Prisma } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindPostsDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsArray()
  @IsOptional()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
