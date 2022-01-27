import { Prisma } from '@prisma/client';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FindPostsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
